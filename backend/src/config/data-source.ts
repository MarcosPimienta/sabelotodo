import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { GameSession } from '../entity/GameSession';
import { Player } from '../entity/Player';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'baloo',
  database: 'sabelotodo',
  synchronize: true,
  logging: false,
  entities: [GameSession, Player],
  migrations: [],
  subscribers: [],
});
