import express from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './database';
import { contentRouter } from './routes/content';

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 4000;

app.use(express.json());

// Initialize the database
initializeDatabase();

// Use the content router
app.use('/api/content', contentRouter);

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
