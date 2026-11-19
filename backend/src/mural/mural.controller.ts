import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MuralService } from './mural.service';
import { CriarRecadoDto } from './dto/criar-recado.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/mural')
export class MuralController {
  constructor(private readonly muralService: MuralService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async listar() {
    return this.muralService.listar();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async criar(@Request() req, @Body() dto: CriarRecadoDto) {
    return this.muralService.criar(req.user.sub, dto);
  }
}
