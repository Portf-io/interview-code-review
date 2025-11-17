import { prisma } from '../config/database';

export async function findDrawdownsByInvestmentId(investmentId: string) {
  return await prisma.drawdown.findMany({ where: { investmentId } });
}

export async function updateDrawdownConvertedAmount(
  id: string, 
  convertedAmount: number, 
  convertedCurrency: string
) {
  return await prisma.drawdown.update({
    where: { id },
    data: { convertedAmount, convertedCurrency, updatedAt: new Date() }
  });
}

