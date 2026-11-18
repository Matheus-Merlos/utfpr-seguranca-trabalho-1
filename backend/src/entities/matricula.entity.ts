import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Disciplina } from './disciplina.entity';
import { Nota } from './nota.entity';

@Entity('matriculas')
export class Matricula {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  alunoId: string;

  @Column()
  disciplinaId: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.matriculas)
  @JoinColumn({ name: 'alunoId' })
  aluno: Usuario;

  @ManyToOne(() => Disciplina, (disciplina) => disciplina.matriculas)
  @JoinColumn({ name: 'disciplinaId' })
  disciplina: Disciplina;

  @OneToMany(() => Nota, (nota) => nota.matricula)
  notas: Nota[];
}
