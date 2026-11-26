import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, Usuario } from '../entities/usuario.entity';
import { AtualizarPerfilDto } from './dto/atualizar-perfil.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async findById(id: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'nomeExibicao', 'role'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async atualizar(id: string, dto: AtualizarPerfilDto): Promise<Usuario> {
    const campos: Partial<Usuario> = {};
    if (dto.nomeExibicao !== undefined) campos.nomeExibicao = dto.nomeExibicao;
    if ('role' in dto && typeof dto.role === 'string') campos.role = dto.role as Role;
    if (dto.email !== undefined) {
      campos.email = dto.email;
      campos.resetTokenHash = null;
      campos.resetTokenExpiraEm = null;
    }
    if (Object.keys(campos).length) await this.usuariosRepository.update(id, campos);
    return this.findById(id);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      select: ['id', 'username', 'email', 'nomeExibicao', 'role'],
    });
  }

  async remover(id: string): Promise<void> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await this.usuariosRepository.delete(id);
  }
}
