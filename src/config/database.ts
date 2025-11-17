import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

export async function connectDatabase() {
  await prisma.$connect();
  console.log('Database connected');
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('Database disconnected');
}

