import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const db = require('../models');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

import apiRoutes from './routes';
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err: any) => {
  console.error("Failed to sync database:", err);
});
