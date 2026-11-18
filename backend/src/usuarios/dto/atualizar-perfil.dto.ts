import { ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizarPerfilDto {
  @ApiPropertyOptional()
  nomeExibicao?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  role?: string;
}
