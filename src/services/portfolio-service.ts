import { findInvestmentsByInvestorId } from '../repositories/investment-repository';
import { findDrawdownsByInvestmentId, updateDrawdownConvertedAmount } from '../repositories/drawdown-repository';
import { convertCurrency } from './currency-service';

export async function calculateTotalDrawdowns(investorId: string): Promise<number> {
  const investments = await findInvestmentsByInvestorId(investorId);
  
  if (!investments || investments.length === 0) {
    return 0;
  }
  
  let total = 0;
  
  for (const investment of investments) {
    const drawdowns = await findDrawdownsByInvestmentId(investment.id);
    
    for (const drawdown of drawdowns) {
      if (drawdown.amount < 0) {
        continue;
      }
      
      const converted = await convertCurrency(
        drawdown.amount, 
        drawdown.currency, 
        'GBP'
      );
      
      await updateDrawdownConvertedAmount(
        drawdown.id, 
        converted, 
        'GBP'
      );
      
      total += converted;
      
      if (converted > 1000) {
        console.log(`Large drawdown detected: ${converted} GBP`);
      }
    }
  }
  
  return Math.round(total * 100) / 100;
}
