import { prisma } from '../config/database';

export async function findInvestmentsByInvestorId(investorId: string) {
  return await prisma.investment.findMany({ where: { investorId } });
}

