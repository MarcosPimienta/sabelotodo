import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import questionRoutes from './routes/questions';
import playerRoutes from './routes/players';
import gameSessionRoutes from './routes/gameSessions';

const app = express();
const port = 3001;

app.use(express.json());

createConnection().then(async connection => {
  console.log('Connected to the database');

  app.use('/api/questions', questionRoutes);
  app.use('/api/players', playerRoutes);
  app.use('/api/game-sessions', gameSessionRoutes);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}).catch(error => console.log(error));
