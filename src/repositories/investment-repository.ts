import { prisma } from '../config/database';

export async function findInvestmentsByInvestorId(investorId: string) {
  return await prisma.investment.findMany({ where: { investorId } });
}

export async function findInvestmentById(investmentId: string) {
  return await prisma.investment.findUnique({ where: { id: investmentId } });
}

export async function updateInvestmentInterestFields(
  investmentId: string,
  latestAccruedInterest: number,
  lastCalculatedAt: Date
) {
  return await prisma.investment.update({
    where: { id: investmentId },
    data: {
      latestAccruedInterest,
      lastCalculatedAt
    }
  });
}

