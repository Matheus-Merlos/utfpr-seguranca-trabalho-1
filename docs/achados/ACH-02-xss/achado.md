# ACH-02 — Cross-Site Scripting

## Informações Gerais

| Campo | Valor |
|-------|-------|
| **ID** | ACH-02 |
| **Título** | HTML controlado pelo usuário é inserido no DOM sem codificação |
| **Categoria OWASP Top 10:2025** | A05 Injection |
| **CWE** | CWE-79 Improper Neutralization of Input During Web Page Generation |
| **Teste WSTG** | WSTG-INPV-02 Testing for Stored Cross Site Scripting; WSTG-CLNT-01 Testing for DOM-Based Cross Site Scripting |
| **Severidade** | Alta |
| **Vetor CVSS 3.1** | AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N |
| **Nota CVSS** | 8.7 |
| **Ativo Afetado** | Página `#/mural`; página `#/busca`; campos `conteudo` e `nomeExibicao` |
| **Responsável** | David Marlon |
| **Data** | 2026-11-21 |
| **Status** | Correção aplicada na branch `fix/ach-02-xss` — aguardando merge, evidência dinâmica e reteste pós-deploy |

## Descrição

O Svelte escapa texto interpolado com `{valor}`. As telas abaixo usam `{@html ...}`, que interpreta a string como HTML.

1. XSS armazenado no mural. `frontend/src/lib/pages/Mural.svelte` renderiza `recado.conteudo` e `recado.autor.nomeExibicao` com `{@html}`. O conteúdo é gravado por `POST /api/mural` e o nome por `PATCH /api/usuarios/me`. Qualquer sessão válida publica o valor. Na leitura seguinte, o navegador de quem abre o mural interpreta esse HTML.
2. XSS de DOM na busca. `frontend/src/lib/pages/Busca.svelte` copia o termo da URL (`#/busca?q=`) para a variável `buscado` e a renderiza com `{@html}`. O script roda no navegador de quem abre o link. Não depende de gravação no servidor.

O cookie de sessão é gravado com `httpOnly: false` (`auth.controller.ts`). Script que rode na origem da aplicação consegue ler o cookie `token`. O impacto de confidencialidade e de integridade no navegador da vítima é alto: a sessão deixa de ser opaca para o script e as ações saem com a credencial da vítima.

`CriarRecadoDto` declara `@IsString()`, mas `main.ts` não registra `ValidationPipe`. O decorador não chega a executar. Não há sanitização de HTML no serviço do mural.

## Pré-condições

- Mural: uma conta qualquer (aluno já basta) e outra pessoa autenticada que abra `#/mural`.
- Busca: a vítima abre um link do laboratório com o termo na query da hash.
- A vítima usa a mesma origem em que o cookie de sessão foi emitido.

## Confirmação

1. Verificar `{@html recado.conteudo}` e `{@html recado.autor.nomeExibicao}` em `Mural.svelte`.
2. Verificar `{@html buscado}` em `Busca.svelte` e a origem de `buscado` (termo digitado ou parâmetro `q` da hash).
3. Verificar `httpOnly: false` no `Set-Cookie` do login.
4. No laboratório, a confirmação visual é a marcação fornecida pelo usuário aparecer interpretada pelo navegador, e não como texto. A ficha não inclui um script de demonstração.

## Evidências

| Arquivo | Descrição |
|---------|-----------|
| `evidencias/ev01-mural-html.png` | `Mural.svelte`, linhas 118 e 123: `{@html}` no nome e no conteúdo |
| `evidencias/ev02-busca-html.png` | `Busca.svelte`: termo copiado da tela e renderizado com `{@html}` |
| `docs/achados/ACH-04-auth-sessao/evidencias/ev03-cookie-flags.png` | Cookie sem `HttpOnly`, legível por script da mesma origem |

## Impacto

Um recado ou um nome de exibição permanece na base e passa a ser executado no navegador dos usuários que abrem o mural, inclusive professor e administrador. Um link de busca afeta quem o abre. Com o cookie legível por script, a sessão da vítima fica disponível para o HTML injetado, que então chama a API com a credencial dela. O componente vulnerável é a página; o dano aparece no navegador. Por isso o escopo CVSS é alterado (`S:C`).

## Justificativa CVSS 3.1

| Métrica | Valor | Justificativa |
|---------|-------|---------------|
| AV | N | Página servida pela aplicação web |
| AC | L | Basta o valor chegar a `{@html}` |
| PR | L | Publicar no mural exige conta comum; o caso armazenado é o pior fluxo persistente |
| UI | R | Outra pessoa precisa abrir o mural ou o link |
| S | C | O código roda no navegador da vítima, fora do servidor que gravou o texto |
| C | H | O cookie de sessão não é HttpOnly |
| I | H | A sessão da vítima autoriza as ações dela na API |
| A | N | Não há negação de serviço do servidor |

Nota 8.7. Faixa alta.

O fluxo só de link (`#/busca`) tem `PR:N` e o mesmo `UI:R`. O vetor acima usa o XSS armazenado, que é o caso de maior persistência.

## Recomendação

- Renderizar `conteudo`, `nomeExibicao` e o termo de busca como texto (`{valor}`), sem `{@html}`.
- Tratar o mural como texto puro. Não há requisito de formatação HTML.
- Marcar o cookie com `HttpOnly` (Patch 3). Isso não corrige o XSS; reduz o que um script consegue ler.
- Registrar `ValidationPipe` se houver validação de tamanho e tipo. Validação não substitui o escape na saída.

Referências: [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [CWE-79](https://cwe.mitre.org/data/definitions/79.html).

## Correção Aplicada

Patch 5 de `docs/correcoes/PATCHES.md`, aplicado na branch `fix/ach-02-xss`. Os três `{@html}` do frontend viraram interpolação de texto do Svelte, que codifica `<`, `>`, `&` e aspas antes de inserir no DOM. Uma busca por `@html` em `frontend/src` não encontra mais nenhuma ocorrência. O `master` continua vulnerável até o merge, para não atrapalhar a coleta de evidência do grupo.

### Código antes

```svelte
<span class="font-semibold text-primary truncate">{@html recado.autor.nomeExibicao}</span>
<div class="text-sm leading-relaxed">{@html recado.conteudo}</div>
```

```svelte
<h2 class="text-lg font-semibold">Resultados para: {@html buscado}</h2>
```

### Código depois

```svelte
<span class="font-semibold text-primary truncate">{recado.autor.nomeExibicao}</span>
<div class="text-sm leading-relaxed">{recado.conteudo}</div>
```

```svelte
<h2 class="text-lg font-semibold">Resultados para: {buscado}</h2>
```

**Pull Request:** não aberto.

## Reteste

### Reteste previsto

- **Critério de aceite:** marcação enviada no recado, no nome de exibição e no termo de busca aparece como texto visível. O navegador não cria elementos a partir desse valor. Login e publicação de texto comum continuam funcionando.

### Verificação estática (executada em 2026-11-21)

| Verificação | Antes (`master`) | Depois (`fix/ach-02-xss`) |
|-------------|------------------|---------------------------|
| Ocorrências de `{@html}` em `frontend/src` | 3 | 0 |
| Chamadas a `$.html()` no JS compilado pelo Svelte 5 — `Mural.svelte` | 2 | 0 |
| Chamadas a `$.html()` no JS compilado pelo Svelte 5 — `Busca.svelte` | 1 | 0 |
| `npm ci && npm run build` no frontend (mesmo passo do CI) | ok | ok |

`$.html()` é o helper do Svelte 5 que insere HTML bruto. A interpolação `{valor}` compila para atribuição de texto, sem esse helper.

### Reteste local no navegador

- Pendente: subir o ambiente (`docker compose up -d`), repetir os três fluxos (recado, nome de exibição e link de busca) e anexar os prints "depois" em `evidencias/`.

### Reteste pós-deploy

- Não executado.

## Critério de Aceite (Checklist)

- [x] Falha identificável pelo código citado
- [x] Vetor CVSS 3.1 completo
- [ ] Screenshots do laboratório
- [ ] Request e response do proxy
- [x] Impacto concreto
- [ ] PR linkado
- [x] Verificação estática da correção (código-fonte, JS compilado e build)
- [ ] Reteste local no navegador executado
- [ ] Reteste pós-deploy executado
