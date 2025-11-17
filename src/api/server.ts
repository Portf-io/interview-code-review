import express, { Request, Response } from 'express';
import { prisma } from '../prisma-client';
import { calculateTotalDrawdowns } from '../services/portfolio-service';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main endpoint - everything inline, no proper error handling
app.get('/api/investor/:id/total-drawdowns', async (req: Request, res: Response) => {
  const investorId = req.params.id;
  
  // No validation of the ID format
  // Direct call to service, no try-catch initially
  try {
    const total = await calculateTotalDrawdowns(investorId);
    
    // Return result directly
    res.json({
      investorId: investorId,
      totalDrawdownsGBP: total
    });
  } catch (error) {
    // Generic error handling, no proper error types
    console.error('Error calculating drawdowns:', error);
    res.status(500).json({ error: 'Failed to calculate drawdowns' });
  }
});

// Bonus endpoint - directly querying DB in route handler (anti-pattern)
app.get('/api/investor/:id/investments', async (req: Request, res: Response) => {
  const investorId = req.params.id;
  
  // Direct Prisma usage in route handler
  const investments = await prisma.investment.findMany({
    where: { investorId: investorId },
    include: { drawdowns: true }
  });
  
  res.json(investments);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

