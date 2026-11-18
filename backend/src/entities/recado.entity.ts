import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Disciplina } from './disciplina.entity';

@Entity('recados')
export class Recado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  conteudo: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column()
  autorId: string;

  @Column({ nullable: true })
  disciplinaId: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.recados)
  @JoinColumn({ name: 'autorId' })
  autor: Usuario;

  @ManyToOne(() => Disciplina, (disciplina) => disciplina.recados, { nullable: true })
  @JoinColumn({ name: 'disciplinaId' })
  disciplina: Disciplina;
}
