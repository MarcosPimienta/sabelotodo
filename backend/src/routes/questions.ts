import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Question } from '../entity/Question';

const router = Router();

router.get('/', async (req, res) => {
  const questions = await getRepository(Question).find();
  res.json(questions);
});

export default router;
