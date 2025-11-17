import { Router } from 'express';
import { calculateTotalDrawdowns } from '../../services/portfolio-service';
import { findInvestmentsByInvestorId } from '../../repositories/investment-repository';
import { findDrawdownsByInvestmentId } from '../../repositories/drawdown-repository';

export const investorRouter = Router();

investorRouter.get('/:id/total-drawdowns', async (req, res) => {
  const total = await calculateTotalDrawdowns(req.params.id);
  res.json({ investorId: req.params.id, totalDrawdownsGBP: total });
});

investorRouter.get('/:id/investments', async (req, res) => {
  const investments = await findInvestmentsByInvestorId(req.params.id);
  
  const investmentsWithDrawdowns = await Promise.all(
    investments.map(async (inv) => ({
      ...inv,
      drawdowns: await findDrawdownsByInvestmentId(inv.id)
    }))
  );
  
  res.json(investmentsWithDrawdowns);
});

