import { prisma } from '../config/database';

export async function findTransactionsByInvestmentId(investmentId: string) {
  return await prisma.transaction.findMany({ 
    where: { investmentId },
    orderBy: { createdAt: 'asc' }
  });
}

export async function createInterestTransaction(
  investmentId: string,
  amount: number,
  currency: string
) {
  return await prisma.transaction.create({
    data: {
      type: 'INTEREST_ACCRUAL',
      amount,
      currency,
      investmentId
    }
  });
}

