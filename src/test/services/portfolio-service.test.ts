import { calculateTotalDrawdowns } from '../../services/portfolio-service';

describe('PortfolioService', () => {
  describe('calculateTotalDrawdowns', () => {
    it.skip('should calculate total drawdowns', async () => {
      const result = await calculateTotalDrawdowns('test-id');
      expect(result).toBeDefined();
    });
  });
});

