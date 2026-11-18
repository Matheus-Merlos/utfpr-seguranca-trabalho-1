import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'admin' })
  senha: string;
}

export class RecuperarSenhaDto {
  @ApiProperty({ example: 'admin@sigacad.edu.br' })
  email: string;
}

export class ResetarSenhaDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  novaSenha: string;
}
