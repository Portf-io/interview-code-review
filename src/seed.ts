import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create an investor
  const investor = await prisma.investor.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      investments: {
        create: [
          {
            name: 'Tech Fund A',
            drawdowns: {
              create: [
                { amount: 5000, currency: 'USD' },
                { amount: 3000, currency: 'USD' },
                { amount: 2000, currency: 'EUR' }
              ]
            }
          },
          {
            name: 'Property Fund B',
            drawdowns: {
              create: [
                { amount: 10000, currency: 'GBP' },
                { amount: 5000, currency: 'EUR' },
                { amount: 1500000, currency: 'JPY' }
              ]
            }
          },
          {
            name: 'Bond Fund C',
            drawdowns: {
              create: [
                { amount: 2500, currency: 'USD' },
                { amount: 1800, currency: 'GBP' }
              ]
            }
          }
        ]
      }
    }
  });
  
  console.log('Created investor:', investor.id);
  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

