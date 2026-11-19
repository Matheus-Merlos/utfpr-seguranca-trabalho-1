import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BoletimService } from './boletim.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('alunos')
export class BoletimController {
  constructor(private readonly boletimService: BoletimService) {}

  @Get(':id/boletim')
  @UseGuards(JwtAuthGuard)
  async getBoletim(@Param('id') id: string) {
    return this.boletimService.getBoletim(id);
  }
}
