import { Controller, Get, Param, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { BoletimService } from './boletim.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('alunos')
export class BoletimController {
  constructor(private readonly boletimService: BoletimService) {}

  @Get(':id/boletim')
  @UseGuards(JwtAuthGuard)
  async getBoletim(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user;

    // Checagem de propriedade (BAC-02 / IDOR): um aluno só pode ver o
    // próprio boletim. Professores e administradores podem ver os demais.
    if (user.role === 'ALUNO' && user.sub !== id) {
      throw new ForbiddenException('Você só pode acessar o seu próprio boletim');
    }

    return this.boletimService.getBoletim(id);
  }
}
