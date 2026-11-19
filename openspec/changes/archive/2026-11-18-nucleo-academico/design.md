## Context

Os changes anteriores criaram a estrutura base e autenticação. Agora implementamos as funcionalidades de negócio do sistema acadêmico. As entidades (Disciplina, Matricula, Nota, Recado) já existem.

## Goals / Non-Goals

**Goals:**
- Implementar busca de disciplinas com SQLi
- Implementar visualização de boletim com IDOR
- Implementar edição de notas sem verificação de role
- Implementar mural com XSS armazenado
- Criar frontend com XSS DOM na busca

**Non-Goals:**
- CRUD completo de disciplinas (admin)
- Gestão de matrículas (admin)
- Relatórios acadêmicos

## Decisions

### D1: SQLi na busca de disciplinas [VULN-02]

A busca concatena o termo diretamente na query LIKE:

```typescript
const result = await this.dataSource.query(
  `SELECT * FROM disciplinas WHERE nome LIKE '%${termo}%' OR codigo LIKE '%${termo}%'`
);
```

Permite UNION-based injection para extrair dados de outras tabelas. Parece código de quem "precisou fazer rápido" e não usou o query builder.

### D2: IDOR no boletim [VULN-05]

O endpoint `/api/alunos/:id/boletim` não verifica se o usuário autenticado é o dono do boletim:

```typescript
@Get(':id/boletim')
@UseGuards(JwtAuthGuard)
async getBoletim(@Param('id') id: string) {
  return this.boletimService.getBoletim(id);
}
```

Falta verificar `if (req.user.sub !== id) throw new ForbiddenException()`. Parece esquecimento de quem confiou no "usuário não vai alterar a URL".

### D3: Falta de role no PATCH de notas [VULN-06]

O endpoint de edição de notas tem apenas `@UseGuards(JwtAuthGuard)`, sem `@Roles('PROFESSOR')`:

```typescript
@Patch(':id')
@UseGuards(JwtAuthGuard)
async atualizarNota(@Param('id') id: string, @Body() dto: AtualizarNotaDto) {
  return this.notasService.atualizar(id, dto);
}
```

Qualquer usuário autenticado pode alterar qualquer nota. Parece que copiaram o guard de outro endpoint e esqueceram de adicionar o decorator de roles.

### D4: XSS armazenado no mural [VULN-03]

O frontend renderiza o conteúdo dos recados com `{@html}`:

```svelte
{#each recados as recado}
  <div class="recado">
    <span class="autor">{@html recado.autor.nomeExibicao}</span>
    <p>{@html recado.conteudo}</p>
  </div>
{/each}
```

A justificativa é "permitir negrito e formatação". Também renderiza o nome de exibição do autor, que pode ser alterado pelo próprio usuário.

### D5: XSS DOM na busca [VULN-04]

A página de busca mostra o termo pesquisado usando `{@html}`:

```svelte
<h2>Resultados para: {@html termo}</h2>
```

O termo vem da query string. Parece que alguém quis "mostrar exatamente o que o usuário digitou" sem sanitizar.

### D6: Estrutura de módulos

```
backend/src/
├── disciplinas/
│   ├── disciplinas.module.ts
│   ├── disciplinas.controller.ts
│   └── disciplinas.service.ts
├── boletim/
│   ├── boletim.module.ts
│   ├── boletim.controller.ts
│   └── boletim.service.ts
├── notas/
│   ├── notas.module.ts
│   ├── notas.controller.ts
│   ├── notas.service.ts
│   └── dto/atualizar-nota.dto.ts
└── mural/
    ├── mural.module.ts
    ├── mural.controller.ts
    ├── mural.service.ts
    └── dto/criar-recado.dto.ts
```

### D7: Fluxo de dados

```
┌─────────────┐                    ┌─────────────┐
│   Aluno     │                    │  Professor  │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       ▼                                  ▼
┌──────────────┐                   ┌──────────────┐
│ GET boletim  │                   │ PATCH notas  │
│ (IDOR)       │                   │ (sem role)   │
└──────────────┘                   └──────────────┘
       │                                  │
       └────────────┬─────────────────────┘
                    ▼
            ┌──────────────┐
            │    Mural     │
            │ (XSS stored) │
            └──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │    Busca     │
            │ (SQLi + DOM) │
            └──────────────┘
```

## Risks / Trade-offs

| Risco | Mitigação |
|-------|-----------|
| SQLi permite extração de dados | Intencional (VULN-02). sqlmap funciona. |
| IDOR expõe boletins de outros | Intencional (VULN-05). Sem verificação. |
| Aluno altera própria nota | Intencional (VULN-06). Sem check de role. |
| XSS rouba sessões | Intencional (VULN-03, 04). {@html} usado. |

## Open Questions

Nenhuma — as decisões estão consolidadas.
