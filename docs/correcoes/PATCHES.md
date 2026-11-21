# Proposta de correção

As mudanças abaixo corrigem as falhas confirmadas na revisão. Nenhuma delas foi aplicada em `backend/` ou `frontend/`. O laboratório continua no estado vulnerável para a coleta de evidência dinâmica. A validação descrita é o critério do reteste, a executar depois que o grupo aplicar o patch numa cópia ou numa branch.

Três correções cobrem achados críticos (nota CVSS a partir de 9.0): Patch 1 (ACH-01), Patch 2 (ACH-04.1) e Patch 3 (ACH-04.2). Os patches 4 a 7 cobrem achados altos e de configuração. O enunciado pede no mínimo três críticas.

## Patch 1 — Consultas parametrizadas (ACH-01, crítica, 9.8)

Arquivo: `backend/src/auth/auth.service.ts` e `backend/src/disciplinas/disciplinas.service.ts`.

Substituir concatenação por parâmetro vinculado. O curinga de `LIKE` fica dentro do valor, não no texto do comando.

```typescript
const result = await this.dataSource.query(
  `SELECT id, username, email, "nomeExibicao", role
   FROM usuarios
   WHERE username = $1 AND senha = $2`,
  [username, hash],
);

const userExists = await this.dataSource.query(
  `SELECT id FROM usuarios WHERE username = $1`,
  [username],
);
```

```typescript
const result = await this.dataSource.query(
  `UPDATE usuarios SET senha = $1 WHERE email = $2 RETURNING id`,
  [hash, email],
);
```

```typescript
const result = await this.dataSource.query(
  `SELECT d.id, d.codigo, d.nome, d."professorId",
          u."nomeExibicao" AS "professorNome"
   FROM disciplinas d
   LEFT JOIN usuarios u ON d."professorId" = u.id
   WHERE d.nome ILIKE $1 OR d.codigo ILIKE $1`,
  [`%${termo}%`],
);
```

### Validação

| Caso | Resultado esperado |
|------|--------------------|
| Login com usuário e senha do seed | 200 e cookie de sessão |
| Usuário inexistente ou senha errada | 401, sem SQL no corpo |
| `username` ou `busca` com metacaractere SQL | 401 ou lista vazia/200, sem a chave `query` e sem o texto do comando |
| Redefinição com e-mail que não é um endereço cadastrado | senha de ninguém é alterada; o e-mail não é interpretado como SQL |

## Patch 2 — Token de redefinição (ACH-04.1, crítica, 9.1)

Arquivo: entidade `Usuario`, `auth.service.ts`.

Incluir colunas `resetTokenHash` (string, nula) e `resetTokenExpiraEm` (data, nula). O token entregue ao usuário é aleatório. A base guarda só o SHA-256. A data do relógio deixa de compor o segredo.

```typescript
import { createHash, randomBytes, timingSafeEqual } from 'crypto';

async recuperarSenha(email: string): Promise<{ message: string }> {
  const usuario = await this.usuarios.findOne({ where: { email } });
  if (usuario) {
    const token = randomBytes(32).toString('base64url');
    usuario.resetTokenHash = createHash('sha256').update(token).digest('hex');
    usuario.resetTokenExpiraEm = new Date(Date.now() + 15 * 60 * 1000);
    await this.usuarios.save(usuario);
    // Entregar `token` por canal fora da resposta HTTP. Não registrar o valor.
  }
  return { message: 'Se o email existir, enviaremos instruções' };
}

async resetarSenha(token: string, novaSenha: string): Promise<{ message: string }> {
  const hash = createHash('sha256').update(token).digest('hex');
  const usuario = await this.usuarios
    .createQueryBuilder('u')
    .where('u.resetTokenHash = :hash', { hash })
    .andWhere('u.resetTokenExpiraEm > :agora', { agora: new Date() })
    .getOne();

  if (!usuario) {
    throw new BadRequestException('Token inválido');
  }

  usuario.senha = await this.hashSenha(novaSenha);
  usuario.resetTokenHash = null;
  usuario.resetTokenExpiraEm = null;
  await this.usuarios.save(usuario);
  return { message: 'Senha atualizada com sucesso' };
}
```

`hashSenha` deste trecho deve passar a ser a função lenta do Patch 6, não MD5. A comparação do hash do token em SQL por igualdade do SHA-256 é aceitável aqui porque o token tem 256 bits de entropia. Não decodificar e-mail a partir do token.

### Validação

| Caso | Resultado esperado |
|------|--------------------|
| Dois pedidos seguidos para o mesmo e-mail | tokens diferentes; só o último hash vale |
| Token antigo, expirado ou nunca emitido | 400 e a senha anterior continua válida |
| Token recém-emitido, dentro de 15 minutos, uma vez | senha troca; o segundo uso do mesmo token falha |
| Log do processo | não contém o token |

## Patch 3 — Sessão JWT (ACH-04.2, crítica, 9.8)

Arquivos: `auth.module.ts`, `jwt.strategy.ts`, `auth.controller.ts`.

```typescript
const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
  throw new Error('JWT_SECRET ausente ou curto demais');
}

JwtModule.register({
  secret,
  signOptions: { expiresIn: '15m', algorithm: 'HS256' },
});
```

```typescript
super({
  jwtFromRequest: (req: Request) => req?.cookies?.['token'] ?? null,
  ignoreExpiration: false,
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});
```

```typescript
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000,
});
```

Remover o literal `segredo123` dos dois arquivos. O mesmo critério vale para o cookie de logout.

### Validação

| Caso | Resultado esperado |
|------|--------------------|
| Processo sem `JWT_SECRET` | a API não sobe |
| Login válido | `Set-Cookie` contém `HttpOnly` e a sessão chama `/api/auth/me` |
| Token com `exp` no passado | 401 |
| Token assinado com o segredo antigo do repositório | 401 |
| Logout | o cookie é apagado e `/api/auth/me` responde 401 |

## Patch 4 — Autorização no servidor (ACH-03, alta, 8.8)

Arquivos: `main.ts`, controllers de usuários, boletim, notas e disciplinas, `atualizar-perfil.dto.ts`, `usuarios.service.ts`.

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

```typescript
export class AtualizarPerfilDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  nomeExibicao?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
```

`role` sai deste DTO. Atualização de papel fica num método com `@Roles('ADMIN')`.

```typescript
@Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
findAll() { /* ... */ }

@Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
atualizar(@Param('id') id: string, @Body() dto: AtualizarPerfilDto) { /* ... */ }

@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
remover(@Param('id') id: string) { /* ... */ }
```

`RolesGuard` precisa estar registrado como provider e deve responder 403 quando `user` não existe, em vez de lançar ao ler `user.role`.

Boletim:

```typescript
async getBoletim(@Param('id') id: string, @Req() req: Request) {
  const user = (req as any).user;
  if (user.role === 'ALUNO' && user.sub !== id) {
    throw new ForbiddenException();
  }
  return this.boletimService.getBoletim(id);
}
```

Notas: antes de salvar, carregar a matrícula da nota, a disciplina e o `professorId`. Permitir a escrita só se `user.role === 'ADMIN'` ou `user.sub === disciplina.professorId`.

Disciplinas: `@UseGuards(JwtAuthGuard)` em `GET :id/alunos`. Lista pública de nome e código pode permanecer, desde que o professor venha por DTO sem a coluna `senha`.

`UsuariosService.atualizar` atribui campo a campo (`nomeExibicao`, `email`). Não usa `Object.assign` com o corpo inteiro.

### Validação

| Caso | Resultado esperado |
|------|--------------------|
| Aluno lê o próprio boletim | 200 |
| Aluno lê boletim de outro id | 403, corpo sem notas |
| Aluno lista, altera ou apaga usuários | 403, base inalterada |
| Aluno envia `role` no próprio perfil | 400 pela lista branca, papel inalterado |
| Aluno altera nota | 403, nota inalterada |
| Professor da turma altera nota da própria turma | 200 |
| `GET /api/disciplinas/:id/alunos` sem cookie | 401 |

## Patch 5 — Saída de texto (ACH-02, alta, 8.7)

Arquivos: `frontend/src/lib/pages/Mural.svelte` e `frontend/src/lib/pages/Busca.svelte`.

Trocar `{@html recado.conteudo}`, `{@html recado.autor.nomeExibicao}` e `{@html buscado}` pela interpolação de texto do Svelte: `{recado.conteudo}`, `{recado.autor.nomeExibicao}`, `{buscado}`.

### Validação

Publicar um recado e um nome que contenham marcação HTML. Abrir o mural e a busca. O navegador mostra os caracteres como texto. A árvore do documento não ganha nó criado por esse conteúdo. Texto comum continua visível.

## Patch 6 — Segredo de senha e erro genérico (ACH-05, alta, 7.5)

```typescript
@Column({ select: false })
senha: string;
```

Trocar `createHash('md5')` por hash de senha com sal e custo (bcrypt, scrypt ou argon2), no login, na redefinição e no seed. Projeção explícita nas relações `autor` e `professor`, sem a coluna `senha`.

Em `AllExceptionsFilter`, responder só `statusCode`, uma mensagem genérica e um identificador de correlação. Gravar `stack` e a consulta no log do servidor.

### Validação

`GET /api/disciplinas` e `GET /api/mural` não possuem a chave `senha`. Uma falha interna não devolve caminho de arquivo nem SQL.

## Patch 7 — Configuração (ACH-06)

- Remover o mapeamento `5432:5432` do compose de laboratório compartilhado, ou restringir o bind a `127.0.0.1` quando o acesso externo não for necessário.
- Obrigar `DB_PASSWORD` sem valor padrão no serviço que sobe fora da máquina do aluno.
- `synchronize: false` fora do desenvolvimento, com migração versionada.
- CORS com lista de origens (`http://localhost:5173` no laboratório). Não refletir `Origin`.
- Montar o Swagger só quando `NODE_ENV !== 'production'`.

### Validação

Origem fora da lista não recebe `Access-Control-Allow-Origin` espelhado com credenciais. A documentação interativa não sobe no modo de produção. A senha do exemplo deixa de autenticar no banco do ambiente corrigido.

## Ordem sugerida

1. Patch 3 e Patch 1, porque fecham sessão forjada e comando SQL sem depender de esquema novo.
2. Patch 2, porque pede colunas novas.
3. Patch 4, porque a autorização passa a ser a barreira que o JWT sozinho não é.
4. Patches 5, 6 e 7.

Cada patch deve ser retestado no laboratório antes do seguinte, com a sessão de aluno e a de administrador do seed. O resultado entra na pasta `evidencias/` do achado correspondente.
