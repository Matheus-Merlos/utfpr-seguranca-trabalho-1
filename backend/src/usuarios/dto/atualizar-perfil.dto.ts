import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class AtualizarPerfilDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nomeExibicao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  // IMPORTANTE: o campo `role` foi removido de propósito.
  // O papel do usuário (ALUNO/PROFESSOR/ADMIN) nunca pode ser definido
  // pelo próprio usuário via perfil — isso permitia escalonamento de
  // privilégio (BAC-03). Alterações de papel devem ter um fluxo próprio,
  // restrito a ADMIN.
}
