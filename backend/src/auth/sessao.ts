import { CookieOptions } from 'express';

export const DURACAO_SESSAO = 15 * 60; // segundos

export function segredoJwt(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret.trim()) < 32) {
    throw new Error('Configure JWT_SECRET com pelo menos 32 bytes aleatórios');
  }
  return secret;
}

export function opcoesCookie(): CookieOptions {
  return {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };
}

export interface Sessao {
  sub: string;
  versao: number;
  exp: number;
}

export function sessaoValida(sessao: Sessao): boolean {
  return typeof sessao?.sub === 'string' && Number.isInteger(sessao.versao) &&
    Number.isFinite(sessao.exp) && sessao.exp > Date.now() / 1000;
}
