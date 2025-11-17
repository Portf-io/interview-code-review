import express, { Request, Response } from 'express';
import { prisma } from '../prisma-client';
import { calculateTotalDrawdowns } from '../services/portfolio-service';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/investor/:id/total-drawdowns', async (req: Request, res: Response) => {
  const investorId = req.params.id;
  
  try {
    const total = await calculateTotalDrawdowns(investorId);
    
    res.json({
      investorId: investorId,
      totalDrawdownsGBP: total
    });
  } catch (error) {
    console.error('Error calculating drawdowns:', error);
    res.status(500).json({ error: 'Failed to calculate drawdowns' });
  }
});

app.get('/api/investor/:id/investments', async (req: Request, res: Response) => {
  const investorId = req.params.id;
  
  const investments = await prisma.investment.findMany({
    where: { investorId: investorId },
    include: { drawdowns: true }
  });
  
  res.json(investments);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

