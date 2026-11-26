import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { segredoJwt, Sessao, sessaoValida } from './sessao';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>) {
    super({
      jwtFromRequest: (req: Request) => req?.cookies?.token ?? null,
      algorithms: ['HS256'],
      secretOrKey: segredoJwt(),
    });
  }

  async validate(payload: Sessao) {
    if (!sessaoValida(payload)) throw new UnauthorizedException();
    const conta = await this.usuarios.findOne({
      where: { id: payload.sub, versaoSessao: payload.versao },
      select: ['id', 'username', 'email', 'nomeExibicao', 'role'],
    });
    if (!conta) throw new UnauthorizedException();
    return { ...conta, sub: conta.id };
  }
}
