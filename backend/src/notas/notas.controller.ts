import { Controller, Patch, Param, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { NotasService } from './notas.service';
import { AtualizarNotaDto } from './dto/atualizar-nota.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROFESSOR', 'ADMIN')
  async atualizar(
    @Param('id') id: string,
    @Body() dto: AtualizarNotaDto,
    @Req() req: Request,
  ) {
    // BAC-01: além de exigir o papel PROFESSOR/ADMIN (acima), o service
    // confere se o professor leciona a disciplina daquela nota.
    return this.notasService.atualizar(id, dto, (req as any).user);
  }
}
