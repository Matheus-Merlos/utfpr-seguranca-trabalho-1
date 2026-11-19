import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { NotasService } from './notas.service';
import { AtualizarNotaDto } from './dto/atualizar-nota.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async atualizar(@Param('id') id: string, @Body() dto: AtualizarNotaDto) {
    return this.notasService.atualizar(id, dto);
  }
}
