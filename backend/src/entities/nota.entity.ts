import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Matricula } from './matricula.entity';

@Entity('notas')
export class Nota {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matriculaId: string;

  @Column()
  tipo: string;

  @Column('decimal', { precision: 4, scale: 2 })
  valor: number;

  @ManyToOne(() => Matricula, (matricula) => matricula.notas)
  @JoinColumn({ name: 'matriculaId' })
  matricula: Matricula;
}
