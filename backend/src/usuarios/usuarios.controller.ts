import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { UsuariosService } from './usuarios.service';
import { AtualizarPerfilDto } from './dto/atualizar-perfil.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  async getPerfil(@Req() req: Request) {
    return this.usuariosService.findById((req as any).user.sub);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar perfil do usuário autenticado' })
  async atualizarPerfil(@Body() dto: AtualizarPerfilDto, @Req() req: Request) {
    return this.usuariosService.atualizar((req as any).user.sub, dto);
  }
}
