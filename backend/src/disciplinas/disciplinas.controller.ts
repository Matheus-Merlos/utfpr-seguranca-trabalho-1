import { Controller, Get, Param, Query } from '@nestjs/common';
import { DisciplinasService } from './disciplinas.service';

@Controller('disciplinas')
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
  async getAlunos(@Param('id') id: string) {
    return this.disciplinasService.getAlunos(id);
  }
}
