# ACH-01 — Injeção de SQL

## Informações Gerais

| Campo | Valor |
|-------|-------|
| **ID** | ACH-01 |
| **Título** | Entrada do usuário é concatenada em comandos SQL |
| **Categoria OWASP Top 10:2025** | A05 Injection |
| **CWE** | CWE-89 Improper Neutralization of Special Elements used in an SQL Command |
| **Teste WSTG** | WSTG-INPV-05 Testing for SQL Injection |
| **Severidade** | Crítica |
| **Vetor CVSS 3.1** | AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H |
| **Nota CVSS** | 9.8 |
| **Ativo Afetado** | `POST /api/auth/login`, `POST /api/auth/resetar-senha`, `GET /api/disciplinas?busca=` |
| **Responsável** | Grupo (preencher) |
| **Data** | 2026-11-21 |
| **Status** | Aberto — correção proposta, código do laboratório preservado |

## Descrição

Três consultas são montadas por concatenação de string. O valor recebido na requisição passa a fazer parte do texto SQL enviado ao PostgreSQL. O driver usado pelo TypeORM (`dataSource.query`) encaminha esse texto ao banco. Não há parâmetro vinculado (`$1`, `$2`) nem consulta construída pelo query builder.

Pontos confirmados no código:

1. Login, em `backend/src/auth/auth.service.ts`. O `username` entra nas duas consultas: a de autenticação e a que distingue “usuário inexistente” de “senha incorreta”. A senha é transformada em MD5 antes da consulta; o ponto de injeção é o nome de usuário.
2. Redefinição de senha, no mesmo arquivo. O e-mail sai do token decodificado e entra num `UPDATE` sem parâmetro. O endpoint é público.
3. Busca de disciplinas, em `backend/src/disciplinas/disciplinas.service.ts`. O parâmetro `busca` entra em duas cláusulas `LIKE`. O endpoint não exige autenticação (`DisciplinasController` não usa `JwtAuthGuard`).

O filtro global `AllExceptionsFilter` devolve `message`, `stack` e a propriedade `query` quando a falha é `QueryFailedError`. Uma entrada que quebra a sintaxe SQL faz a API responder com o comando executado. Isso confirma que a entrada foi interpretada como SQL e ainda revela a estrutura do banco.

A pasta do trabalho rotula injeção como A03. Na lista oficial OWASP Top 10:2025, injeção é A05.

## Pré-condições

- API acessível na rede do laboratório.
- Nenhuma conta é necessária para a busca de disciplinas nem para a redefinição de senha.
- O login também é anônimo.

## Confirmação

A evidência desta entrega é a revisão do código (white box), não uma exploração.

1. Localizar as três interpolações citadas na descrição.
2. No laboratório, enviar no parâmetro afetado um metacaractere que a gramática SQL não aceita como dado literal.
3. Observar se o corpo do erro contém a consulta SQL e a pilha. Isso demonstra que o texto da requisição alterou o comando.
4. Não é necessário extrair dados nem contornar o login para classificar o achado. Esse efeito é consequência da mesma falha e deve ser descrito no impacto, sem ser executado fora do ambiente autorizado do grupo.

## Evidências

| Arquivo | Descrição |
|---------|-----------|
| `evidencias/ev01-login-sql.png` | `auth.service.ts`, linhas 21–28: `username` concatenado nas duas consultas do login |
| `evidencias/ev02-reset-sql.png` | `auth.service.ts`, linhas 77–79: e-mail concatenado no `UPDATE` |
| `evidencias/ev03-busca-sql.png` | `disciplinas.service.ts`, linhas 24–29: `termo` concatenado no `LIKE` |
| `docs/achados/ACH-05-exposicao/evidencias/ev02-erro-com-sql.png` | Filtro que devolve a SQL no erro |

Prints do código-fonte. Captura de tela da aplicação em execução e do proxy continuam pendentes.

## Impacto

Quem alcança a API pode alterar o significado das consultas de autenticação, de atualização de senha e de busca. O efeito prático é leitura e alteração de registros da aplicação, inclusive credenciais e notas, e a possibilidade de desfazer dados. A busca e o login não pedem sessão. O filtro de erro reduz o esforço, porque devolve o comando rejeitado pelo banco.

## Justificativa CVSS 3.1

| Métrica | Valor | Justificativa |
|---------|-------|---------------|
| AV | N | HTTP da API |
| AC | L | A falha está na montagem da string; não depende de condição de corrida |
| PR | N | Os três fluxos aceitam chamada sem sessão válida |
| UI | N | Não depende de outra pessoa |
| S | U | O dano permanece nos dados da aplicação |
| C | H | As consultas alcançam tabelas com dados de todos os usuários |
| I | H | Há `UPDATE` concatenado e a mesma classe de falha permite escrever via SQL |
| A | H | A escrita SQL alcança a base que sustenta a aplicação |

Nota 9.8. Faixa crítica (9.0–10.0).

## Recomendação

- Trocar as três consultas por comandos parametrizados. O valor de busca, se precisar de curinga, deve ir dentro do parâmetro (`%termo%`), não na estrutura do SQL.
- Restringir o `SELECT` do login às colunas de identidade. Não usar `SELECT *`.
- Parar de devolver `stack` e `query` ao cliente (ver ACH-06).
- Fazer a busca de disciplinas exigir sessão, se o dado não for público.

Referências: [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html), [CWE-89](https://cwe.mitre.org/data/definitions/89.html), WSTG-INPV-05.

## Correção Aplicada

Proposta em `docs/correcoes/PATCHES.md` (Patch 1). O código em execução do laboratório não foi modificado, para a coleta de evidência dinâmica continuar possível.

### Código antes

```typescript
const result = await this.dataSource.query(
  `SELECT * FROM usuarios WHERE username = '${username}' AND senha = '${hash}'`
);
```

```typescript
`UPDATE usuarios SET senha = '${hash}' WHERE email = '${email}' RETURNING id`
```

```typescript
`WHERE d.nome LIKE '%${termo}%' OR d.codigo LIKE '%${termo}%'`
```

### Código depois

```typescript
const result = await this.dataSource.query(
  `SELECT id, username, email, "nomeExibicao", role
   FROM usuarios WHERE username = $1 AND senha = $2`,
  [username, hash],
);
```

```typescript
await this.dataSource.query(
  `UPDATE usuarios SET senha = $1 WHERE email = $2 RETURNING id`,
  [hash, email],
);
```

```typescript
await this.dataSource.query(
  `SELECT d.id, d.codigo, d.nome, d."professorId",
          u."nomeExibicao" AS "professorNome"
   FROM disciplinas d
   LEFT JOIN usuarios u ON d."professorId" = u.id
   WHERE d.nome ILIKE $1 OR d.codigo ILIKE $1`,
  [`%${termo}%`],
);
```

**Pull Request:** não aberto. A correção permanece proposta.

## Reteste

### Reteste previsto (após aplicar o Patch 1)

- **Data:** a preencher no laboratório
- **Resultado:** não executado
- **Critério de aceite:**
  - metacaractere SQL no usuário, no e-mail do fluxo de redefinição e em `busca` não altera a estrutura do comando;
  - a resposta não contém a propriedade `query` nem trecho de SQL;
  - usuário e senha válidos do seed ainda autenticam;
  - um nome de disciplina existente ainda é encontrado.

### Reteste pós-deploy

- Não se aplica a esta etapa. Não houve deploy da correção.

## Critério de Aceite (Checklist)

- [x] A falha é identificável pelo código citado
- [x] Vetor CVSS 3.1 completo
- [ ] Screenshots com URL visível (coleta do grupo no laboratório)
- [ ] Request e response do proxy (coleta do grupo no laboratório)
- [x] Impacto concreto descrito
- [ ] PR de correção linkado
- [ ] Reteste local executado
- [ ] Reteste pós-deploy executado
