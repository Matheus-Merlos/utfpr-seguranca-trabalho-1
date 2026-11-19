import { Injectable, NotFoundException } from '@nestjs/common';
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

  async atualizar(id: string, dto: AtualizarNotaDto): Promise<Nota> {
    const nota = await this.notasRepository.findOne({ where: { id } });
    if (!nota) {
      throw new NotFoundException('Nota não encontrada');
    }

    Object.assign(nota, dto);
    return this.notasRepository.save(nota);
  }
}
