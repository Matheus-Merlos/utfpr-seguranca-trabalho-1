import { Controller, Get, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
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

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todos os usuários' })
  async findAll() {
    return this.usuariosService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar usuário por ID' })
  async atualizar(@Param('id') id: string, @Body() dto: AtualizarPerfilDto) {
    return this.usuariosService.atualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remover usuário por ID' })
  async remover(@Param('id') id: string) {
    return this.usuariosService.remover(id);
  }
}
