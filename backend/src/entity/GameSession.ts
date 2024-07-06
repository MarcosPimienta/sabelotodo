import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Player } from './Player';

@Entity()
export class GameSession {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;

  @OneToMany(() => Player, (player) => player.gameSession)
  players!: Player[];
}
