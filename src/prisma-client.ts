import { PrismaClient } from '@prisma/client';

// Just export a new instance directly, no singleton pattern, no proper initialization
export const prisma = new PrismaClient();

