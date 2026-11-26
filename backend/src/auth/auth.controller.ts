import { Controller, Post, Get, Body, Res, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RecuperarSenhaDto, ResetarSenhaDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { DURACAO_SESSAO, opcoesCookie } from './sessao';
import { Usuario } from '../entities/usuario.entity';

@ApiTags('auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.authService.login(dto.username, dto.senha);

    res.cookie('token', token, {
      ...opcoesCookie(),
      maxAge: DURACAO_SESSAO * 1000,
    });

    return { message: 'Login realizado com sucesso', user };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Encerrar sessão' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.cookies?.token);
    res.clearCookie('token', opcoesCookie());

    return { message: 'Logout realizado com sucesso' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter usuário autenticado' })
  me(@Req() req: Request & { user: Pick<Usuario, 'id' | 'username' | 'email' | 'nomeExibicao' | 'role'> }) {
    const { id, username, email, nomeExibicao, role } = req.user;
    return { id, username, email, nomeExibicao, role };
  }

  @Post('recuperar-senha')
  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  async recuperarSenha(@Body() dto: RecuperarSenhaDto) {
    return this.authService.recuperarSenha(dto.email);
  }

  @Post('resetar-senha')
  @ApiOperation({ summary: 'Resetar senha com token' })
  async resetarSenha(@Body() dto: ResetarSenhaDto) {
    return this.authService.resetarSenha(dto.token, dto.novaSenha);
  }
}
