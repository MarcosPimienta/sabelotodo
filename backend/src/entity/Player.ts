import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { GameSession } from './GameSession';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  position!: number;

  @Column()
  score!: number;

  @ManyToOne(() => GameSession, (gameSession) => gameSession.players)
  gameSession!: GameSession;
}
