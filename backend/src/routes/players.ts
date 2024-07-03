import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Player } from '../entity/Player';

const router = Router();

router.get('/', async (req, res) => {
  const players = await getRepository(Player).find();
  res.json(players);
});

router.post('/', async (req, res) => {
  const player = await getRepository(Player).save(req.body);
  res.json(player);
});

export default router;
