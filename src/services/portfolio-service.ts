import { prisma } from '../prisma-client';
import { getExchangeRate } from './currency-api';

export async function calculateTotalDrawdowns(investorId: string): Promise<number> {
  const investor = await prisma.investor.findUnique({
    where: { id: investorId }
  });
  
  if (!investor) {
    return 0;
  }
  
  const investments = await prisma.investment.findMany({
    where: { investorId: investorId }
  });
  
  let totalDrawdown = 0;
  
  for (let i = 0; i < investments.length; i++) {
    const investment = investments[i];
    
    const drawdowns = await prisma.drawdown.findMany({
      where: { investmentId: investment.id }
    });
    
    for (let j = 0; j < drawdowns.length; j++) {
      const drawdown = drawdowns[j];
      
      if (drawdown.amount < 0) {
        continue;
      }
      
      let convertedAmount = drawdown.amount;
      
      if (drawdown.currency !== 'GBP') {
        const rate = await getExchangeRate(drawdown.currency, 'GBP');
        convertedAmount = drawdown.amount * rate;
        
        convertedAmount = Math.round(convertedAmount * 100) / 100;
      }
      
      totalDrawdown += convertedAmount;
      
      if (convertedAmount > 1000) {
        console.log(`Large drawdown detected: ${convertedAmount} GBP`);
      }
    }
  }
  
  totalDrawdown = Math.round(totalDrawdown * 100) / 100;
  
  return totalDrawdown;
}

