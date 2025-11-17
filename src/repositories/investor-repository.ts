import { prisma } from '../config/database';

export async function findInvestorById(id: string) {
  return await prisma.investor.findUnique({ where: { id } });
}

