import { Controller, Post, Get, Body, Res, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RecuperarSenhaDto, ResetarSenhaDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.authService.login(dto.username, dto.senha);

    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Login realizado com sucesso', user };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Encerrar sessão' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('token', '', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      expires: new Date(0),
    });

    return { message: 'Logout realizado com sucesso' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter usuário autenticado' })
  async me(@Req() req: Request) {
    return this.authService.getMe((req as any).user.sub);
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
