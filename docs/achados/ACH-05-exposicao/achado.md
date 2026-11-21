# ACH-05 — Exposição de dados sensíveis e de detalhe interno

## Informações Gerais

| Campo | Valor |
|-------|-------|
| **ID** | ACH-05 |
| **Título** | Hash de senha na resposta JSON e SQL/pilha no erro |
| **Categoria OWASP Top 10:2025** | A01 Broken Access Control (CWE-200); A04 Cryptographic Failures (MD5); A10 Mishandling of Exceptional Conditions (CWE-209) |
| **CWE** | CWE-200 Exposure of Sensitive Information; CWE-916 Use of Password Hash With Insufficient Computational Effort; CWE-209 Generation of Error Message Containing Sensitive Information |
| **Teste WSTG** | WSTG-ERRH-01 Testing for Improper Error Handling; WSTG-CRYP-04 Testing for Weak Encryption |
| **Severidade** | Alta |
| **Vetor CVSS 3.1** | AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N |
| **Nota CVSS** | 7.5 |
| **Ativo Afetado** | `GET /api/disciplinas` (lista sem filtro), `GET /api/mural`, corpo de erro de `AllExceptionsFilter` |
| **Responsável** | Grupo (preencher) |
| **Data** | 2026-11-21 |
| **Status** | Aberto |

## Descrição

A coluna `senha` da entidade `Usuario` não usa `select: false`. Consultas que carregam a relação `professor` ou `autor` serializam o hash.

`GET /api/disciplinas`, sem o parâmetro `busca`, chama `find({ relations: ['professor'] })` e não exige sessão. A resposta inclui o objeto do professor com o MD5 da senha. A busca com termo usa SQL que projeta só `professorNome` e não tem esse vazamento.

`GET /api/mural` carrega `autor` inteiro para qualquer sessão.

O hash é MD5 sem sal (`auth.service.ts` e `database/seed.ts`). Não é um segredo resistente a teste offline. As senhas iniciais do seed são curtas e iguais dentro de cada papel. Isso é dado de laboratório, mas o algoritmo seria fraco com senhas reais.

`AllExceptionsFilter` acrescenta `stack` em toda exceção HTTP e, em `QueryFailedError`, a propriedade `query`. O cliente recebe estrutura de tabela, caminho de arquivo e o comando. Isso alimenta o ACH-01 e permanece uma falha mesmo depois da injeção ser corrigida.

`GET /api/usuarios` já limita as colunas e não entra neste achado.

## Pré-condições

- Rede até a API, para a lista de disciplinas e para um erro de consulta.
- Sessão qualquer, para o mural.

## Evidências

| Arquivo | Descrição |
|---------|-----------|
| `evidencias/ev01-hash-na-entidade.png` | Coluna `senha` sem `select: false`, e a listagem que carrega a relação `professor` |
| `evidencias/ev02-erro-com-sql.png` | Filtro de erro inclui `stack` e a propriedade `query` |

## Confirmação

1. Chamar `GET /api/disciplinas` sem `busca` e sem cookie.
2. Verificar se o JSON do professor contém `senha`.
3. Provocar um erro de consulta já coberto pelo ACH-01 e verificar `stack` e `query` no JSON. Não é uma segunda vulnerabilidade de injeção; é o canal que revela o comando.

## Impacto

Os hashes dos professores saem sem autenticação. Com MD5 sem sal, o teste offline da senha é barato, e o acesso resultante é o da conta daquele professor. A pilha e a SQL entregam mapa interno da API a quem provoca um erro.

O vetor 7.5 cobre a divulgação dos hashes (`C:H` do conjunto de credenciais exposto por esse endpoint, `I:N`, `A:N`, `PR:N`). A quebra do MD5 é o fator que torna o dado exposto uma credencial reutilizável; o CVSS base não soma um segundo ataque.

## Recomendação

- `select: false` na coluna `senha`, ou um DTO de saída sem essa coluna em toda serialização.
- Função de senha lenta e com sal. Rehash no próximo login se o formato antigo for reconhecido. Não reutilizar as senhas do seed fora do laboratório.
- Resposta de erro com mensagem genérica e correlação em log no servidor. Sem `stack` e sem `query` no JSON.

## Correção Aplicada

Incluída nos Patches 1 e 6 de `docs/correcoes/PATCHES.md` (projeção das colunas, coluna `senha` oculta, filtro de erro). Não aplicada.

## Reteste previsto

- `GET /api/disciplinas` não contém a chave `senha`.
- `GET /api/mural` não contém a chave `senha`.
- Uma requisição inválida responde sem `stack` e sem `query`.
- O login com a senha do laboratório continua possível depois da troca do algoritmo, quando o patch de hash for aplicado e o seed for regravado.

## Critério de Aceite (Checklist)

- [x] Falha identificável pelo código citado
- [x] Vetor CVSS 3.1 completo
- [ ] Screenshots do laboratório
- [x] Impacto concreto
- [ ] Reteste executado
