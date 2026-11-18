import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        if (req && req.cookies) {
          return req.cookies['token'];
        }
        return null;
      },
      ignoreExpiration: true,
      secretOrKey: 'segredo123',
    });
  }

  async validate(payload: any) {
    return { sub: payload.sub, username: payload.username, role: payload.role };
  }
}
