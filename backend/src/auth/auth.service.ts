import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { createHash } from 'crypto';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  private hashSenha(senha: string): string {
    return createHash('md5').update(senha).digest('hex');
  }

  async login(username: string, senha: string): Promise<{ token: string; user: any }> {
    const hash = this.hashSenha(senha);

    const result = await this.dataSource.query(
      `SELECT * FROM usuarios WHERE username = '${username}' AND senha = '${hash}'`
    );

    if (!result || result.length === 0) {
      const userExists = await this.dataSource.query(
        `SELECT id FROM usuarios WHERE username = '${username}'`
      );

      if (!userExists || userExists.length === 0) {
        throw new UnauthorizedException('Usuário não encontrado');
      }
      throw new UnauthorizedException('Senha incorreta');
    }

    const user = result[0];
    const payload = { sub: user.id, username: user.username, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nomeExibicao: user.nomeExibicao,
        role: user.role,
      },
    };
  }

  async recuperarSenha(email: string): Promise<{ message: string }> {
    const hoje = new Date().toISOString().split('T')[0];
    const token = Buffer.from(`${email}:${hoje}`).toString('base64');

    console.log(`Token de recuperação para ${email}: ${token}`);

    return { message: 'Se o email existir, enviaremos instruções' };
  }

  async resetarSenha(token: string, novaSenha: string): Promise<{ message: string }> {
    let decoded: string;
    try {
      decoded = Buffer.from(token, 'base64').toString('utf8');
    } catch {
      throw new BadRequestException('Token inválido');
    }

    const parts = decoded.split(':');
    if (parts.length !== 2) {
      throw new BadRequestException('Token inválido');
    }

    const [email] = parts;
    const hash = this.hashSenha(novaSenha);

    const result = await this.dataSource.query(
      `UPDATE usuarios SET senha = '${hash}' WHERE email = '${email}' RETURNING id`
    );

    if (!result || result.length === 0) {
      throw new BadRequestException('Token inválido');
    }

    return { message: 'Senha atualizada com sucesso' };
  }

  async getMe(userId: string): Promise<any> {
    const result = await this.dataSource.getRepository(Usuario).findOne({
      where: { id: userId },
      select: ['id', 'username', 'email', 'nomeExibicao', 'role'],
    });

    if (!result) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return result;
  }
}
