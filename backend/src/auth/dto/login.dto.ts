import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  username: string;

  @ApiProperty()
  @IsString()
  @Length(1, 1024)
  senha: string;
}

export class RecuperarSenhaDto {
  @ApiProperty()
  @IsEmail()
  @MaxLength(254)
  email: string;
}

export class ResetarSenhaDto {
  @ApiProperty()
  @Matches(/^[0-9a-f]{64}$/, { message: 'Código inválido ou expirado' })
  token: string;

  @ApiProperty()
  @IsString()
  @Length(12, 128, { message: 'A nova senha deve ter entre 12 e 128 caracteres' })
  novaSenha: string;
}
