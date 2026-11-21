# ACH-03 — Controle de acesso quebrado

## Informações Gerais

| Campo | Valor |
|-------|-------|
| **ID** | ACH-03 |
| **Título** | A API autoriza pela presença do JWT, sem papel nem dono do registro |
| **Categoria OWASP Top 10:2025** | A01 Broken Access Control |
| **CWE** | CWE-862 Missing Authorization; CWE-639 Authorization Bypass Through User-Controlled Key; CWE-915 Improperly Controlled Modification of Dynamically-Determined Object Attributes |
| **Teste WSTG** | WSTG-ATHZ-02 Testing for Bypassing Authorization Schema; WSTG-ATHZ-04 Testing for Insecure Direct Object References |
| **Severidade** | Alta |
| **Vetor CVSS 3.1** | AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H |
| **Nota CVSS** | 8.8 |
| **Ativo Afetado** | `GET/PATCH/DELETE /api/usuarios`, `PATCH /api/usuarios/me`, `GET /api/alunos/:id/boletim`, `PATCH /api/notas/:id`, `GET /api/disciplinas` e `GET /api/disciplinas/:id/alunos` |
| **Responsável** | Grupo (preencher) |
| **Data** | 2026-11-21 |
| **Status** | Aberto — correção proposta, código do laboratório preservado |

## Descrição

A interface esconde links conforme `user.role` em `sidebar.svelte`. O servidor não repete essa regra. `RolesGuard` e o decorador `@Roles` existem em `backend/src/auth/` e não são referenciados por nenhum controller. Estar autenticado, para a maioria das rotas, equivale a poder executar a ação sobre qualquer identificador.

Falhas distintas, mesmo controle ausente:

1. **Referência direta insegura.** `GET /api/alunos/:id/boletim` devolve o boletim do UUID informado. O controller não compara `:id` com `req.user.sub`. A tela do aluno só pede o próprio id; a API aceita outro.
2. **Função administrativa sem papel.** `GET /api/usuarios`, `PATCH /api/usuarios/:id` e `DELETE /api/usuarios/:id` usam apenas `JwtAuthGuard`. Qualquer sessão lista usuários, altera outro cadastro ou apaga a conta.
3. **Atribuição em massa.** `AtualizarPerfilDto` declara `role`. `UsuariosService.atualizar` faz `Object.assign(usuario, dto)` e salva. Não há `ValidationPipe` nem lista branca. O corpo pode alterar `role` e qualquer coluna cujo nome viaje no JSON, inclusive em `PATCH /api/usuarios/me`.
4. **Escrita de nota sem vínculo com a turma.** `PATCH /api/notas/:id` exige JWT e não verifica se o autor é professor da matrícula. O identificador da nota escolhe o registro.
5. **Leitura sem autenticação.** `GET /api/disciplinas` e `GET /api/disciplinas/:id/alunos` não têm guard. A listagem traz as disciplinas; o sub-recurso traz nome e notas dos alunos da turma.

Isso não é defeito de tela. A política de acesso não existe no componente que a impõe.

## Pré-condições

- Itens 1 a 4: uma conta de aluno, que é o menor privilégio do seed.
- Item 5: acesso de rede à API, sem sessão.
- Identificadores obtidos de respostas da própria API (lista de usuários, lista de disciplinas ou o boletim).

## Confirmação

1. Conferir a ausência de `@Roles` e de checagem de dono nos controllers citados.
2. No laboratório, com a sessão de um aluno, chamar um endpoint de outro aluno e um endpoint de administração.
3. Resultado que caracteriza a falha: HTTP 200 e o recurso de terceiros, ou a própria conta com `role` elevado. O resultado esperado depois da correção é 403, sem alterar o registro.

## Evidências

| Arquivo | Descrição |
|---------|-----------|
| `evidencias/ev01-usuarios-sem-papel.png` | Lista, alteração e remoção só com `JwtAuthGuard` |
| `evidencias/ev02-atribuicao-em-massa.png` | Campo `role` no DTO e `Object.assign` do corpo |
| `evidencias/ev03-boletim-idor.png` | Boletim pelo `:id`, sem comparar com o sujeito do token |
| `evidencias/ev04-notas-sem-autorizacao.png` | Atualização de nota sem checar o professor da turma |
| `evidencias/ev05-disciplinas-sem-auth.png` | Lista e alunos da disciplina sem guard |

## Impacto

Um aluno lê o boletim dos colegas, lança ou substitui notas e apaga usuários. Pelo mesmo `PATCH`, promove a própria sessão a `ADMIN` no banco. A partir daí o papel no JWT antigo pode continuar `ALUNO` até novo login, mas o registro já é administrativo e o próximo token sai com o papel novo. Sem sessão, a lista de disciplinas conduz às notas da turma.

A disponibilidade entra no CVSS porque `DELETE /api/usuarios/:id` remove contas, inclusive a de administração.

## Justificativa CVSS 3.1

| Métrica | Valor | Justificativa |
|---------|-------|---------------|
| AV | N | API HTTP |
| AC | L | O identificador vem da própria API; não há condição extra |
| PR | L | O pior caso de escrita exige apenas uma conta comum |
| UI | N | A chamada é direta |
| S | U | Dados e contas da própria aplicação |
| C | H | Boletins, cadastros e notas de todos os alunos |
| I | H | Alteração de nota, papel e cadastro |
| A | H | Remoção de contas |

Nota 8.8. Faixa alta. Fica abaixo de 9.0 porque a escrita exige uma conta. A leitura de notas por turma, sozinha, seria `PR:N` e nota 7.5 (`C:H/I:N/A:N`); o vetor do achado usa o pior caso coberto pelo mesmo controle ausente.

## Recomendação

- Negar por padrão. Aplicar `RolesGuard` nos métodos de administração e de lançamento de notas.
- No boletim, permitir o próprio `sub`. Professor e administrador só com regra explícita.
- Em notas, autorizar somente o professor da disciplina daquela matrícula, ou um administrador.
- Remover `role` do DTO de perfil. Papel muda por um caso de uso separado, restrito a administrador.
- Registrar `ValidationPipe` com `whitelist: true` e `forbidNonWhitelisted: true`.
- Exigir autenticação em `/api/disciplinas/:id/alunos`.

Referências: [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), [CWE-862](https://cwe.mitre.org/data/definitions/862.html), [CWE-639](https://cwe.mitre.org/data/definitions/639.html).

## Correção Aplicada

Proposta no Patch 4 de `docs/correcoes/PATCHES.md`. Não aplicada ao código do laboratório.

### Código antes

```typescript
@Patch(':id')
@UseGuards(JwtAuthGuard)
async atualizar(@Param('id') id: string, @Body() dto: AtualizarPerfilDto) {
  return this.usuariosService.atualizar(id, dto);
}
```

```typescript
Object.assign(usuario, dto);
```

### Código depois

O método administrativo passa a usar `JwtAuthGuard` e `RolesGuard` com `@Roles('ADMIN')`. O perfil do próprio usuário atualiza só `nomeExibicao` e `email`. O boletim compara `id` com `req.user.sub` quando o papel é `ALUNO`.

**Pull Request:** não aberto.

## Reteste

### Reteste previsto

- Conta `ALUNO` em `GET /api/alunos/{id de outro}/boletim` recebe 403 e o corpo não traz notas.
- Conta `ALUNO` em `DELETE /api/usuarios/{id}` e em `PATCH` com `role` recebe 403, e o papel no banco permanece.
- Conta `ALUNO` em `PATCH /api/notas/{id}` recebe 403, e as notas permanecem.
- `GET /api/disciplinas/{id}/alunos` sem cookie recebe 401.
- O aluno continua lendo o próprio boletim. Um professor da turma continua lançando a nota da própria turma.

### Reteste pós-deploy

- Não executado.

## Critério de Aceite (Checklist)

- [x] Falha identificável pelo código citado
- [x] Vetor CVSS 3.1 completo
- [ ] Screenshots do laboratório
- [ ] Request e response do proxy
- [x] Impacto concreto
- [ ] PR linkado
- [ ] Reteste local executado
- [ ] Reteste pós-deploy executado
