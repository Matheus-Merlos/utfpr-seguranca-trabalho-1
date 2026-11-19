import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recado } from '../entities/recado.entity';
import { CriarRecadoDto } from './dto/criar-recado.dto';

@Injectable()
export class MuralService {
  constructor(
    @InjectRepository(Recado)
    private recadosRepository: Repository<Recado>,
  ) {}

  async listar(): Promise<Recado[]> {
    return this.recadosRepository.find({
      relations: ['autor', 'disciplina'],
      order: { dataHora: 'DESC' },
    });
  }

  async criar(autorId: string, dto: CriarRecadoDto): Promise<Recado> {
    const recado = this.recadosRepository.create({
      autorId,
      conteudo: dto.conteudo,
      disciplinaId: dto.disciplinaId || null,
    });
    return this.recadosRepository.save(recado);
  }
}
