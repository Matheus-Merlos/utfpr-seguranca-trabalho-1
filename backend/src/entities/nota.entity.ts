import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Matricula } from './matricula.entity';

@Entity('notas')
export class Nota {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matriculaId: string;

  @Column('decimal', { precision: 4, scale: 2, nullable: true })
  nota1: number;

  @Column('decimal', { precision: 4, scale: 2, nullable: true })
  nota2: number;

  @Column('decimal', { precision: 4, scale: 2, nullable: true })
  notaFinal: number;

  @ManyToOne(() => Matricula, (matricula) => matricula.notas)
  @JoinColumn({ name: 'matriculaId' })
  matricula: Matricula;
}
