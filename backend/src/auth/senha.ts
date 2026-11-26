import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

// Registra o custo no formato para distinguir versões futuras.
const formato = 'scrypt$32768$8$3';
const opcoes = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };

function derivar(senha: string, sal: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(senha, sal, 32, opcoes, (erro, chave) => erro ? reject(erro) : resolve(chave));
  });
}

export async function hashSenha(senha: string): Promise<string> {
  const sal = randomBytes(16);
  const chave = await derivar(senha, sal);
  return [formato, sal.toString('hex'), chave.toString('hex')].join('$');
}

export async function verificarSenha(senha: string, salvo?: string) {
  const partes = salvo?.split('$');
  if (partes?.length === 6 && partes.slice(0, 4).join('$') === formato &&
      /^[a-f0-9]{32}$/.test(partes[4]) && /^[a-f0-9]{64}$/.test(partes[5])) {
    const chave = await derivar(senha, Buffer.from(partes[4], 'hex'));
    return { valida: timingSafeEqual(chave, Buffer.from(partes[5], 'hex')) };
  }

  // Também faz o trabalho do scrypt para usuários ausentes e registros legados.
  const novoHash = await hashSenha(senha);
  if (!salvo || !/^[a-f0-9]{32}$/.test(salvo)) return { valida: false };
  const legado = createHash('md5').update(senha).digest();
  return { valida: timingSafeEqual(legado, Buffer.from(salvo, 'hex')), novoHash };
}

export const senhasDemonstracao = { admin: 'admin', professor: 'prof123', aluno: 'aluno123' };
