import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Disciplina } from '../entities/disciplina.entity';
import { Matricula } from '../entities/matricula.entity';

@Injectable()
export class DisciplinasService {
  constructor(
    @InjectRepository(Disciplina)
    private disciplinasRepository: Repository<Disciplina>,
    @InjectRepository(Matricula)
    private matriculasRepository: Repository<Matricula>,
    private dataSource: DataSource,
  ) {}

  async buscar(termo?: string): Promise<Disciplina[]> {
    if (!termo) {
      return this.disciplinasRepository.find({
        relations: ['professor'],
      });
    }

    const result = await this.dataSource.query(
      `SELECT d.*, u."nomeExibicao" as "professorNome"
       FROM disciplinas d
       LEFT JOIN usuarios u ON d."professorId" = u.id
       WHERE d.nome LIKE '%${termo}%' OR d.codigo LIKE '%${termo}%'`
    );
    return result;
  }

  async findOne(id: string): Promise<Disciplina> {
    const disciplina = await this.disciplinasRepository.findOne({
      where: { id },
      relations: ['professor'],
    });
    if (!disciplina) {
      throw new NotFoundException('Disciplina não encontrada');
    }
    return disciplina;
  }

  async getAlunos(disciplinaId: string) {
    const matriculas = await this.matriculasRepository.find({
      where: { disciplinaId },
      relations: ['aluno', 'notas'],
    });

    return matriculas.map((m) => ({
      alunoId: m.aluno.id,
      nomeExibicao: m.aluno.nomeExibicao,
      matriculaId: m.id,
      nota1: m.notas?.[0]?.nota1,
      nota2: m.notas?.[0]?.nota2,
      notaFinal: m.notas?.[0]?.notaFinal,
    }));
  }
}
