import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nota } from '../entities/nota.entity';
import { AtualizarNotaDto } from './dto/atualizar-nota.dto';

@Injectable()
export class NotasService {
  constructor(
    @InjectRepository(Nota)
    private notasRepository: Repository<Nota>,
  ) {}

  async atualizar(
    id: string,
    dto: AtualizarNotaDto,
    user: { sub: string; role: string },
  ): Promise<Nota> {
    const nota = await this.notasRepository.findOne({
      where: { id },
      relations: ['matricula', 'matricula.disciplina'],
    });
    if (!nota) {
      throw new NotFoundException('Nota não encontrada');
    }

    // Checagem de propriedade (BAC-01): um professor só altera notas das
    // disciplinas que ele mesmo leciona. ADMIN pode alterar qualquer nota.
    if (
      user.role !== 'ADMIN' &&
      nota.matricula?.disciplina?.professorId !== user.sub
    ) {
      throw new ForbiddenException(
        'Você só pode alterar notas das disciplinas que leciona',
      );
    }

    Object.assign(nota, dto);
    return this.notasRepository.save(nota);
  }
}
