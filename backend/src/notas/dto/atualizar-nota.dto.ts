import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class AtualizarNotaDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  nota1?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  nota2?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  notaFinal?: number;
}
