import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DisciplinasService } from './disciplinas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// BAC-04: todas as rotas de disciplinas agora exigem autenticação.
// Antes, qualquer pessoa sem login lia a lista de disciplinas e de alunos.
@Controller('disciplinas')
@UseGuards(JwtAuthGuard)
export class DisciplinasController {
  constructor(private readonly disciplinasService: DisciplinasService) {}

  @Get()
  async buscar(@Query('busca') busca?: string) {
    return this.disciplinasService.buscar(busca);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.disciplinasService.findOne(id);
  }

  @Get(':id/alunos')
  @UseGuards(RolesGuard)
  @Roles('PROFESSOR', 'ADMIN')
  async getAlunos(@Param('id') id: string) {
    // Lista de alunos e notas: restrita a PROFESSOR/ADMIN.
    return this.disciplinasService.getAlunos(id);
  }
}
