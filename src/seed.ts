import { prisma } from './config/database';

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
            interestRate: 5.5,
            compoundingFrequency: 'MONTHLY',
            startDate: new Date('2024-01-15'),
            drawdowns: {
              create: [
                { amount: 5000, currency: 'USD' },
                { amount: 3000, currency: 'USD' },
                { amount: 2000, currency: 'EUR' }
              ]
            },
            transactions: {
              create: [
                { type: 'DRAWDOWN', amount: 5000, currency: 'USD' },
                { type: 'DRAWDOWN', amount: 3000, currency: 'USD' },
                { type: 'REPAYMENT', amount: 1000, currency: 'USD' }
              ]
            }
          },
          {
            name: 'Property Fund B',
            interestRate: 7.2,
            compoundingFrequency: 'QUARTERLY',
            startDate: new Date('2023-11-01'),
            drawdowns: {
              create: [
                { amount: 10000, currency: 'GBP' },
                { amount: 5000, currency: 'EUR' },
                { amount: 1500000, currency: 'JPY' }
              ]
            },
            transactions: {
              create: [
                { type: 'DRAWDOWN', amount: 10000, currency: 'GBP' },
                { type: 'DRAWDOWN', amount: 5000, currency: 'EUR' },
                { type: 'REPAYMENT', amount: 2000, currency: 'GBP' }
              ]
            }
          },
          {
            name: 'Bond Fund C',
            interestRate: 4.0,
            compoundingFrequency: 'ANNUALLY',
            startDate: new Date('2024-03-10'),
            drawdowns: {
              create: [
                { amount: 2500, currency: 'USD' },
                { amount: 1800, currency: 'GBP' }
              ]
            },
            transactions: {
              create: [
                { type: 'DRAWDOWN', amount: 2500, currency: 'USD' },
                { type: 'DRAWDOWN', amount: 1800, currency: 'GBP' }
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

