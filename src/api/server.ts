import express, { Request, Response } from 'express';
import { investorRouter } from './routes/investor.routes';
import { errorHandler } from './middleware/error-handler';
import { connectDatabase } from '../config/database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/investor', investorRouter);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  await connectDatabase();
  console.log(`Server is running on port ${PORT}`);
});

