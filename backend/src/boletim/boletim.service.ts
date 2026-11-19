import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matricula } from '../entities/matricula.entity';
import { Nota } from '../entities/nota.entity';

@Injectable()
export class BoletimService {
  constructor(
    @InjectRepository(Matricula)
    private matriculasRepository: Repository<Matricula>,
    @InjectRepository(Nota)
    private notasRepository: Repository<Nota>,
  ) {}

  async getBoletim(alunoId: string) {
    const matriculas = await this.matriculasRepository.find({
      where: { alunoId },
      relations: ['disciplina', 'notas'],
    });

    return matriculas.map((matricula) => {
      const nota = matricula.notas[0];
      const notaFinal = nota?.notaFinal ?? null;
      let status = 'CURSANDO';
      if (notaFinal !== null) {
        status = notaFinal >= 6 ? 'APROVADO' : 'REPROVADO';
      }

      return {
        id: nota?.id ?? matricula.id,
        disciplina: {
          codigo: matricula.disciplina.codigo,
          nome: matricula.disciplina.nome,
        },
        nota1: nota?.nota1 ?? null,
        nota2: nota?.nota2 ?? null,
        notaFinal,
        status,
      };
    });
  }
}
