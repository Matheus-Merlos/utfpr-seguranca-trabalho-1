import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Disciplina } from './disciplina.entity';
import { Matricula } from './matricula.entity';
import { Recado } from './recado.entity';

export enum Role {
  ALUNO = 'ALUNO',
  PROFESSOR = 'PROFESSOR',
  ADMIN = 'ADMIN',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  senha: string;

  @Column({ nullable: true, type: 'varchar', length: 64, unique: true, select: false })
  resetTokenHash: string | null;

  @Column({ nullable: true, type: 'timestamptz', select: false })
  resetTokenExpiraEm: Date | null;

  @Column({ default: 0, select: false })
  versaoSessao: number;

  @Column()
  nomeExibicao: string;

  @Column({ type: 'enum', enum: Role, default: Role.ALUNO })
  role: Role;

  @OneToMany(() => Disciplina, (disciplina) => disciplina.professor)
  disciplinasLecionadas: Disciplina[];

  @OneToMany(() => Matricula, (matricula) => matricula.aluno)
  matriculas: Matricula[];

  @OneToMany(() => Recado, (recado) => recado.autor)
  recados: Recado[];
}
