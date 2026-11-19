import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CriarRecadoDto {
  @IsString()
  conteudo: string;

  @IsOptional()
  @IsUUID()
  disciplinaId?: string;
}
