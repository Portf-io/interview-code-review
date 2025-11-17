import { findInvestmentsByInvestorId, findInvestmentById, updateInvestmentInterestFields } from '../repositories/investment-repository';
import { findTransactionsByInvestmentId, createInterestTransaction } from '../repositories/transaction-repository';
import { findDrawdownsByInvestmentId } from '../repositories/drawdown-repository';
import { convertCurrency } from './currency-service';

export interface LoanPosition {
  investmentId: string;
  investmentName: string;
  outstandingPrincipal: number;
  accruedInterest: number;
  outstandingPrincipalGBP: number;
  accruedInterestGBP: number;
}

export class PrivateDebtCalculator {
  private readonly baseCurrency = 'GBP';

  async calculateLoanPositions(investorId: string): Promise<LoanPosition[]> {
    const investments = await findInvestmentsByInvestorId(investorId);
    
    if (!investments || investments.length === 0) {
      return [];
    }

    const positions: LoanPosition[] = [];

    for (const investment of investments) {
      const outstandingPrincipal = await this.calculateOutstandingPrincipal(investment.id);
      const accruedInterest = await this.calculateAccruedInterest(investment.id);
      
      const outstandingPrincipalGBP = await convertCurrency(
        outstandingPrincipal,
        await this.getInvestmentCurrency(investment.id),
        this.baseCurrency
      );

      const accruedInterestGBP = await convertCurrency(
        accruedInterest,
        await this.getInvestmentCurrency(investment.id),
        this.baseCurrency
      );

      positions.push({
        investmentId: investment.id,
        investmentName: investment.name,
        outstandingPrincipal,
        accruedInterest,
        outstandingPrincipalGBP,
        accruedInterestGBP
      });
    }

    return positions;
  }

  private async calculateOutstandingPrincipal(investmentId: string): Promise<number> {
    const transactions = await findTransactionsByInvestmentId(investmentId);
    
    let principal = 0;
    
    for (const transaction of transactions) {
      if (transaction.type === 'DRAWDOWN') {
        principal += transaction.amount;
      } else if (transaction.type === 'REPAYMENT') {
        principal -= transaction.amount;
      }
    }

    const drawdowns = await findDrawdownsByInvestmentId(investmentId);
    for (const drawdown of drawdowns) {
      if (drawdown.amount > 0) {
        principal += drawdown.amount;
      }
    }

    return Math.max(0, principal);
  }

  private async calculateAccruedInterest(investmentId: string): Promise<number> {
    const loan = await findInvestmentById(investmentId);
    if (!loan) {
      return 0;
    }
    
    if (!loan.interestRate || !loan.startDate || !loan.compoundingFrequency) {
      return 0;
    }

    const drawdowns = await findDrawdownsByInvestmentId(investmentId);
    if (drawdowns.length === 0) {
      return 0;
    }

    const principal = await this.calculateOutstandingPrincipal(investmentId);
    const startDate = new Date(loan.startDate);
    const now = new Date();
    const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    let interest = 0;
    const annualRate = loan.interestRate / 100;
    
    if (loan.compoundingFrequency === 'MONTHLY') {
      const periods = daysElapsed / 30;
      interest = principal * (Math.pow(1 + annualRate / 12, periods) - 1);
    } else if (loan.compoundingFrequency === 'QUARTERLY') {
      const periods = daysElapsed / 90;
      interest = principal * (Math.pow(1 + annualRate / 4, periods) - 1);
    } else if (loan.compoundingFrequency === 'ANNUALLY') {
      const periods = daysElapsed / 365;
      interest = principal * (Math.pow(1 + annualRate, periods) - 1);
    } else {
      const periods = daysElapsed / 365;
      interest = principal * annualRate * periods;
    }

    const currency = await this.getInvestmentCurrency(investmentId);
    
    await updateInvestmentInterestFields(investmentId, interest, now);
    
    await createInterestTransaction(investmentId, interest, currency);

    return Math.round(interest * 100) / 100;
  }

  private async getInvestmentCurrency(investmentId: string): Promise<string> {
    const drawdowns = await findDrawdownsByInvestmentId(investmentId);
    if (drawdowns.length > 0) {
      return drawdowns[0].currency;
    }
    
    const transactions = await findTransactionsByInvestmentId(investmentId);
    if (transactions.length > 0) {
      return transactions[0].currency;
    }
    
    return 'GBP';
  }
}

