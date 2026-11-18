import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Matricula } from './matricula.entity';
import { Recado } from './recado.entity';

@Entity('disciplinas')
export class Disciplina {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nome: string;

  @Column()
  professorId: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.disciplinasLecionadas)
  @JoinColumn({ name: 'professorId' })
  professor: Usuario;

  @OneToMany(() => Matricula, (matricula) => matricula.disciplina)
  matriculas: Matricula[];

  @OneToMany(() => Recado, (recado) => recado.disciplina)
  recados: Recado[];
}
