import { Router } from 'express';
import { getRepository } from 'typeorm';
import { GameSession } from '../entity/GameSession';

const router = Router();

router.get('/', async (req, res) => {
  const sessions = await getRepository(GameSession).find({ relations: ["players"] });
  res.json(sessions);
});

export default router;
