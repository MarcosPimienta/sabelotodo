import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/data-source';
import { GameSession } from './entity/GameSession';

const app = express();
const port = 3001;

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to the database');

    // Example route
    app.get('/api/game-sessions', async (req, res) => {
      const gameSessionRepository = AppDataSource.getRepository(GameSession);
      const gameSessions = await gameSessionRepository.find();
      res.json(gameSessions);
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));
