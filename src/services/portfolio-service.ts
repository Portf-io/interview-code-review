import { prisma } from '../prisma-client';
import { getExchangeRate } from './currency-api';

// Large messy function that does everything - no separation of concerns
export async function calculateTotalDrawdowns(investorId: string): Promise<number> {
  // Direct Prisma query inline
  const investor = await prisma.investor.findUnique({
    where: { id: investorId }
  });
  
  // No null check, just assume it exists
  if (!investor) {
    return 0; // Just return 0, no proper error handling
  }
  
  // Get all investments for this investor
  const investments = await prisma.investment.findMany({
    where: { investorId: investorId }
  });
  
  let totalDrawdown = 0;
  
  // N+1 query problem - read DB inside loop
  for (let i = 0; i < investments.length; i++) {
    const investment = investments[i];
    
    // Another DB query inside the loop
    const drawdowns = await prisma.drawdown.findMany({
      where: { investmentId: investment.id }
    });
    
    // Process each drawdown synchronously in a loop
    for (let j = 0; j < drawdowns.length; j++) {
      const drawdown = drawdowns[j];
      
      // Hardcoded business rule: skip negative amounts (should be validation but it's inline)
      if (drawdown.amount < 0) {
        continue; // Just skip it, no logging
      }
      
      // Another hardcoded rule: if currency is GBP, no conversion needed
      let convertedAmount = drawdown.amount;
      
      if (drawdown.currency !== 'GBP') {
        // Call external API for each drawdown individually (inefficient)
        const rate = await getExchangeRate(drawdown.currency, 'GBP');
        convertedAmount = drawdown.amount * rate;
        
        // Round to 2 decimal places inline (should be a utility function)
        convertedAmount = Math.round(convertedAmount * 100) / 100;
      }
      
      // Accumulate directly
      totalDrawdown += convertedAmount;
      
      // Random console.log in the middle of business logic
      if (convertedAmount > 1000) {
        console.log(`Large drawdown detected: ${convertedAmount} GBP`);
      }
    }
    
    // More inline logic - check if investment has no drawdowns
    if (drawdowns.length === 0) {
      // Do nothing, but could have been handled earlier
    }
  }
  
  // Final rounding (duplicated logic)
  totalDrawdown = Math.round(totalDrawdown * 100) / 100;
  
  // Return the result, no validation, no error handling
  return totalDrawdown;
}

