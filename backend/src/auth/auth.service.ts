import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'node:crypto';
import { MoreThan, Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { EmailRecuperacao } from './email-recuperacao';
import { hashSenha, senhasDemonstracao, verificarSenha } from './senha';
import { Sessao, sessaoValida } from './sessao';

function digestToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>,
    private readonly jwt: JwtService,
    private readonly email: EmailRecuperacao,
  ) {}

  async login(username: string, senha: string) {
    const conta = await this.usuarios.findOne({
      where: { username },
      select: ['id', 'username', 'email', 'nomeExibicao', 'role', 'senha', 'versaoSessao'],
    });
    const verificada = await verificarSenha(senha, conta?.senha);
    const senhaPublica = process.env.NODE_ENV === 'production' && Object.values(senhasDemonstracao).includes(senha);
    if (!conta || !verificada.valida || senhaPublica) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    if (verificada.novoHash) {
      // Um login concorrente nunca deve sobrescrever uma senha recém-redefinida.
      await this.usuarios.update({ id: conta.id, senha: conta.senha }, { senha: verificada.novoHash });
    }
    const { id, email, nomeExibicao, role } = conta;
    const token = this.jwt.sign({ sub: id, versao: conta.versaoSessao });
    return { token, user: { id, username, email, nomeExibicao, role } };
  }

  async logout(token?: string) {
    if (!token) return;
    let sessao: Sessao;
    try {
      sessao = this.jwt.verify<Sessao>(token);
    } catch {
      return;
    }
    if (sessaoValida(sessao)) {
      await this.usuarios.increment({ id: sessao.sub, versaoSessao: sessao.versao }, 'versaoSessao', 1);
    }
  }

  async recuperarSenha(email: string) {
    this.email.verificarConfiguracao();
    const token = randomBytes(32).toString('hex');
    const pedido = await this.usuarios.update({ email }, {
      resetTokenHash: digestToken(token),
      resetTokenExpiraEm: new Date(Date.now() + 15 * 60_000),
    });
    if (pedido.affected === 1) this.email.enviar(email, token);
    return { message: 'Se o email existir, enviaremos instruções' };
  }

  async resetarSenha(token: string, novaSenha: string) {
    const resetTokenHash = digestToken(token);
    const invalido = () => new BadRequestException('Código inválido ou expirado');
    if (!(await this.usuarios.existsBy({ resetTokenHash, resetTokenExpiraEm: MoreThan(new Date()) }))) {
      throw invalido();
    }
    const senha = await hashSenha(novaSenha);
    // O próprio UPDATE verifica a validade e consome o código, mesmo em chamadas simultâneas.
    const resultado = await this.usuarios.update({ resetTokenHash, resetTokenExpiraEm: MoreThan(new Date()) }, {
      senha,
      resetTokenHash: null,
      resetTokenExpiraEm: null,
      versaoSessao: () => '"versaoSessao" + 1',
    });
    if (!resultado.affected) throw invalido();
    return { message: 'Senha atualizada com sucesso' };
  }
}
