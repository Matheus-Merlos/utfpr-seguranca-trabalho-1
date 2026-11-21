# Relatório de auditoria de segurança — SIGAcad

| Campo | Valor |
|-------|-------|
| Documento | Relatório técnico de auditoria |
| Aplicação | SIGAcad — sistema de gestão acadêmica (API NestJS, interface Svelte, PostgreSQL) |
| Repositório | `utfpr-seguranca-trabalho-1` |
| Tipo de exame | Revisão de código (white box) sobre aplicação vulnerável por construção, em laboratório acadêmico |
| Padrão | OWASP Top 10:2025, OWASP Web Security Testing Guide, CVSS 3.1 |
| Data | 21 de novembro de 2026 |
| Versão | 1.0 |
| Classificação | Uso acadêmico. O alvo é este repositório, no ambiente do grupo |
| Responsável | Grupo (preencher nomes e RA) |

As fichas completas estão em `docs/achados/ACH-*/achado.md`. A proposta de patch e o roteiro de validação estão em `docs/correcoes/PATCHES.md`. Este arquivo é o consolidado.

## 1. Sumário executivo

O SIGAcad concentra, no código que atende o navegador, falhas que entregam a base de dados, a senha das contas e a sessão. Três delas são críticas na escala CVSS 3.1 (nota igual ou maior que 9,0).

Um visitante sem conta alcança comandos SQL pelo login, pela troca de senha e pela busca de disciplinas, porque esses valores são colados no texto da consulta. A troca de senha aceita um token derivado só do e-mail e da data, e a data nem é conferida. O segredo que assina a sessão está escrito no código, e a verificação ignora expiração. Qualquer um desses três caminhos chega à conta de administração e, por ela, às notas e aos cadastros.

Há ainda falhas altas que não dependem das críticas. A API trata “estar logado” como permissão para ler o boletim de outro aluno, alterar nota, apagar usuário e gravar o próprio papel. O mural e a busca inserem texto do usuário como HTML. A lista de disciplinas, sem login, devolve o hash MD5 da senha dos professores. O erro HTTP devolve a consulta SQL e a pilha. O compose publica o PostgreSQL com senha padrão.

Nenhuma correção foi aplicada na árvore que o laboratório executa. Os patches estão propostos para o grupo aplicar e retestar, e então anexar captura de tela, requisição e resposta. Esta versão não contém essa evidência dinâmica.

Prioridade recomendada, antes de qualquer dado que não seja o seed de laboratório:

1. Parametrizar o SQL e parar de devolver a consulta no erro.
2. Trocar o segredo e a expiração da sessão, e o cookie para `HttpOnly`.
3. Substituir o token de redefinição de senha por um valor aleatório, de uso único.
4. Impor papel e dono do registro no servidor.
5. Renderizar mural e busca como texto.

## 2. Escopo

### Dentro do exame

- API em `backend/src`: autenticação, usuários, disciplinas, boletim, notas, mural, filtro de erro, módulo TypeORM.
- Interface em `frontend/src`: login, busca, mural, perfil, boletim, notas, administração, guarda de rota no cliente.
- Configuração local: `docker-compose.yml`, `.env.example`, `infra/cloud-init.yaml`, `infra/Caddyfile.tpl`.

### Fora do exame

- Exploração contra host que não seja o laboratório do grupo.
- Varredura ativa (ZAP/Burp) e captura de tela. As pastas `docs/scans/` e `evidencias/` continuam à espera dessa coleta.
- Correção aplicada e reteste em ambiente implantado.
- Dependências de terceiros (cadeia de suprimento, A03:2025). Não houve análise de CVEs de bibliotecas.
- O identificador que a tela de notas envia para `PATCH /api/notas/:id` pode não ser o id da linha de nota. Isso é defeito funcional. Não entra como achado. A falha de segurança desse endpoint é a ausência de autorização, independente de qual id a tela manda.

### Alvo

Aplicação de laboratório, vulnerável por construção. Os achados descrevem o comportamento deste código. Não são uma autorização para repetir o teste fora deste repositório.

## 3. Metodologia

O roteiro segue o OWASP Web Security Testing Guide (WSTG), na modalidade white box: o teste começa pelo código e pela configuração, e o ensaio dinâmico fica como confirmação para o laboratório.

| Fase WSTG | O que foi examinado | Resultado |
|-----------|---------------------|-----------|
| WSTG-INFO | Rotas, papéis, entidades, seed, superfície HTTP | Mapa da seção 4 |
| WSTG-CONF | Compose, CORS, Swagger, `synchronize`, segredos padrão | ACH-06 |
| WSTG-IDNT | Mensagens distintas de login, e-mail no exemplo do DTO | Item de enumeração no ACH-04 |
| WSTG-ATHN | Login, recuperação e redefinição de senha, credencial padrão do banco, hash | ACH-01, ACH-04, ACH-05, ACH-06 |
| WSTG-ATHZ | Guards, dono do recurso, papel, atribuição em massa | ACH-03 |
| WSTG-SESS | Emissão do JWT, expiração, cookie, logout | ACH-04 |
| WSTG-INPV | Concatenação SQL, HTML na saída, DTOs | ACH-01, ACH-02 |
| WSTG-ERRH | `AllExceptionsFilter` | ACH-05 |
| WSTG-CRYP | MD5, segredo JWT embutido, token de reset sem segredo | ACH-04, ACH-05 |
| WSTG-CLNT | `{@html}`, hash da URL, CORS | ACH-02, ACH-06 |
| WSTG-BUSL | Regra de nota e de boletim só na interface | ACH-03 |

Cada achado foi classificado com CVSS 3.1 (métricas base), calculado pela especificação FIRST. A faixa usada é a do `docs/templates/GUIA-CVSS.md`: crítica a partir de 9,0, alta de 7,0 a 8,9.

A taxonomia do relatório é a OWASP Top 10:2025. As pastas já existentes do trabalho foram escritas com a numeração de 2021 (injeção como A03, autenticação como A07 com o nome antigo). A correspondência é:

| Pasta | Lista 2025 |
|-------|------------|
| ACH-01 e ACH-02 | A05 Injection |
| ACH-03 e parte do ACH-05 | A01 Broken Access Control |
| ACH-04 | A07 Authentication Failures |
| Hash MD5 | A04 Cryptographic Failures |
| ACH-06 | A02 Security Misconfiguration |
| Erro com SQL e pilha | A10 Mishandling of Exceptional Conditions |

Não houve teste de A03 Software Supply Chain Failures, A06 Insecure Design como categoria isolada, A08 Integrity Failures além do que já está na sessão, nem A09 Logging Failures além do token escrito em log.

## 4. Aplicação examinada

O navegador fala com a API em `/api`, com cookie `token`. Os papéis previstos são `ALUNO`, `PROFESSOR` e `ADMIN`. O menu muda conforme o papel. A rota da interface só verifica se existe usuário logado; não verifica o papel. O servidor, na maior parte dos métodos, também não verifica.

Dados de interesse no seed de laboratório: um administrador, três professores e vinte alunos, com senha definida no código do seed e armazenada em MD5. Esses valores existem para o laboratório. Não devem ser reutilizados em outro sistema.

## 5. Quadro de achados

| ID | Achado | OWASP 2025 | CWE | CVSS | Severidade |
|----|--------|------------|-----|------|------------|
| ACH-01 | SQL concatenado em login, redefinição de senha e busca | A05 | CWE-89 | 9.8 | Crítica |
| ACH-04.2 | JWT com segredo fixo e sem expiração | A07 | CWE-798, CWE-613 | 9.8 | Crítica |
| ACH-04.1 | Token de redefinição de senha previsível | A07 | CWE-640 | 9.1 | Crítica |
| ACH-03 | Autorização ausente, IDOR e atribuição em massa | A01 | CWE-862, CWE-639, CWE-915 | 8.8 | Alta |
| ACH-02 | XSS armazenado no mural e XSS de DOM na busca | A05 | CWE-79 | 8.7 | Alta |
| ACH-05 | Hash MD5 de senha na resposta e detalhe interno no erro | A01, A04, A10 | CWE-200, CWE-916, CWE-209 | 7.5 | Alta |
| ACH-06 | Banco com senha padrão e porta publicada; CORS reflexivo | A02 | CWE-798, CWE-942 | 9.8 se a porta for alcançável; 5.4 no CORS | Alta no laboratório local |

Ordem do quadro: nota base, e no empate o que não exige conta. ACH-06 fica por último porque a nota 9.8 só vale se o PostgreSQL aceitar conexão de fora da máquina. Isso não foi medido.

## 6. Achados

O texto abaixo resume a ficha. A versão com checklist, pré-condição e critério de reteste é o `achado.md` de cada pasta.

### ACH-01 — Injeção de SQL

**Onde.** `AuthService.login`, `AuthService.resetarSenha` e `DisciplinasService.buscar`.

**Falha.** `username`, o e-mail extraído do token e o parâmetro `busca` entram no comando por interpolação de string. Não há parâmetro `$1`. A busca e o login são anônimos. O `UPDATE` da senha também é anônimo, porque o e-mail vem do corpo da requisição de redefinição.

**Por que é vulnerabilidade, e não defeito de validação.** O banco recebe a entrada como parte da sintaxe. O filtro de exceção devolve a propriedade `query` quando o PostgreSQL rejeita o comando, o que confirma a interpretação e revela o texto executado.

**Impacto.** Leitura e alteração da base da aplicação, inclusive credenciais e notas, sem sessão prévia.

**CVSS.** `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` = 9.8.

**Correção.** Patch 1. Consultas parametrizadas e projeção explícita de colunas.

### ACH-04 — Autenticação e sessão

**Redefinição de senha.** O token é o e-mail e a data do dia em Base64. Não há segredo nem registro do token emitido. Na troca, a data é descartada. O valor é escrito no log. Quem conhece o formato e um e-mail cadastrado define a senha daquela conta. CVSS `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N` = 9.1.

**JWT.** O segredo literal é `segredo123` na emissão e na verificação. Não há prazo de expiração, e `ignoreExpiration` está ligado. Um token assinado com esse segredo é aceito com o papel que o emissor colocar no corpo, inclusive `ADMIN`. O logout não invalida o token. CVSS `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` = 9.8.

**Cookie.** `HttpOnly` e `Secure` desligados. Script da mesma origem lê a sessão. Isso eleva o XSS (ACH-02) e é corrigido no mesmo patch da sessão.

**Itens menores no mesmo fluxo.** MD5 sem sal; mensagens “Usuário não encontrado” e “Senha incorreta”; ausência de limite de tentativas. Ficam no mesmo achado, com prioridade abaixo dos dois itens críticos.

**Correção.** Patch 2 (token aleatório, hash guardado, 15 minutos, uso único, sem log) e Patch 3 (`JWT_SECRET` obrigatório, expiração, `ignoreExpiration: false`, cookie `HttpOnly`).

### ACH-03 — Controle de acesso

**Onde.** Usuários, boletim, notas e alunos da disciplina. `RolesGuard` existe e não é usado.

**Falha.** Qualquer JWT chama `GET /api/usuarios`, `PATCH` e `DELETE` por id. `PATCH /api/usuarios/me` aceita `role` porque o campo está no DTO e o serviço faz `Object.assign` do corpo. `GET /api/alunos/:id/boletim` não compara o id com o sujeito do token. `PATCH /api/notas/:id` não verifica se o autor é o professor da turma. `GET /api/disciplinas/:id/alunos` não exige sessão e devolve nome e nota.

**Impacto.** Um aluno lê boletim alheio, substitui nota, apaga contas e grava o próprio papel como administrador. Sem conta, lê as notas de uma turma cujo id a lista de disciplinas já fornece.

**CVSS.** `AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H` = 8.8, pelo caso que exige uma conta e alcança exclusão. A leitura anônima das notas, isolada, seria 7.5.

**Correção.** Patch 4. Papel no servidor, dono do boletim, professor da turma na nota, DTO de perfil sem `role`, `ValidationPipe` com lista branca.

### ACH-02 — XSS

**Onde.** `Mural.svelte` renderiza conteúdo do recado e nome do autor com `{@html}`. `Busca.svelte` faz o mesmo com o termo, que também vem da hash da URL.

**Falha.** O valor controlado pelo usuário vira HTML no navegador de quem abre a página. O cookie de sessão não é `HttpOnly`, então o script da origem passa a dispor da credencial da vítima.

**CVSS.** `AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N` = 8.7. Escopo alterado porque o código executa no navegador, não no NestJS.

**Correção.** Patch 5. Interpolar como texto. O `HttpOnly` do Patch 3 é complementar e não substitui o escape.

### ACH-05 — Exposição

**Onde.** `GET /api/disciplinas` sem filtro carrega a entidade do professor, cuja coluna `senha` não está oculta. `GET /api/mural` faz o mesmo com o autor. O filtro global de erro acrescenta `stack` e, em falha de SQL, `query`.

**Falha.** Hash MD5 sem sal sai para quem pede a lista de disciplinas, sem login. O algoritmo não resiste a teste offline. O erro entrega o comando e o caminho interno.

**CVSS.** `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N` = 7.5, pela divulgação dos hashes.

**Correção.** Patch 6. `select: false` em `senha`, hash de senha lento, erro genérico com correlação só no log.

### ACH-06 — Configuração

**Onde.** Compose publica `5432` e cai para a senha `sigacad`. O mesmo padrão está no cloud-init. CORS reflete qualquer `Origin` com credenciais. Swagger em `/api/docs` não tem autenticação. `synchronize: true` altera o esquema na subida.

**CVSS.** Credencial padrão do banco, se a porta aceitar conexão externa: `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` = 9.8. No laboratório preso à máquina do aluno essa condição não foi demonstrada, e a severidade prática cai. CORS reflexivo, com o cookie `SameSite=Lax` atual: `AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N` = 5.4.

**Correção.** Patch 7.

## 7. Correções e validação

O detalhe de código está em `docs/correcoes/PATCHES.md`. Resumo do que o enunciado exige (três críticas) e do que o quadro pede em seguida.

| Patch | Achado | Estado | O que o reteste precisa mostrar |
|-------|--------|--------|---------------------------------|
| 1 | ACH-01 | Proposto | Metacaractere SQL não muda o comando e não volta no JSON. Login legítimo continua |
| 2 | ACH-04.1 | Proposto | Token não emitido não troca senha. Token emitido funciona uma vez e não aparece em log |
| 3 | ACH-04.2 | Proposto | Segredo antigo e token vencido recebem 401. Cookie sai com `HttpOnly` |
| 4 | ACH-03 | Proposto | Aluno recebe 403 ao ler boletim alheio, lançar nota, listar ou apagar usuários, ou enviar `role` |
| 5 | ACH-02 | Proposto | Marcação no recado, no nome e na busca aparece como texto |
| 6 | ACH-05 | Proposto | JSON sem a chave `senha`. Erro sem `stack` e sem `query` |
| 7 | ACH-06 | Proposto | Porta do banco e CORS restritos ao laboratório. Swagger fora do modo de produção |

Validação desta versão: revisão da correção proposta contra o código vulnerável. Não houve execução do patch, portanto não há reteste local nem pós-deploy. O checklist de screenshot e de proxy das fichas permanece aberto de propósito.

Ordem de aplicação sugerida: Patch 3, Patch 1, Patch 2, Patch 4, depois 5, 6 e 7. Retestar cada um com as contas do seed antes de seguir.

## 8. Recomendações gerais

- Tratar a autorização como regra de servidor, coberta por teste automatizado de aluno, professor e anônimo em cada método que lê ou grava dado de outra pessoa.
- Um só lugar para emitir sessão e um segredo que não vive no Git. Rotacionar o valor que hoje está no código assim que o Patch 3 entrar.
- Resposta de erro única para o cliente. Detalhe técnico só no log, sem senha, token ou SQL.
- Separar DTO de entrada e DTO de saída. A entidade com a coluna `senha` não deve ser o corpo HTTP.
- Manter o seed e a senha de exemplo confinados ao compose local.

## 9. Limitações

- Não foi feita exploração ativa, varredura ZAP nem histórico de proxy. A confirmação é o código. A evidência de tela pedida pelo template ainda cabe ao grupo, no laboratório.
- Não foi medido se a porta 5432 aceita conexão além de localhost. A nota 9.8 do ACH-06 depende disso.
- Não foi feita análise de CVEs das dependências.
- Não foi verificado o comportamento do driver diante de mais de um comando na mesma string. A nota de disponibilidade do ACH-01 considera que a classe da falha permite escrita SQL, o que o `UPDATE` concatenado já demonstra por si.
- Defeitos funcionais sem efeito de confidencialidade, integridade ou autenticação foram deixados de fora.

## 10. Conclusão

O laboratório cumpre o papel de concentrar falhas do Top 10: injeção, autenticação, controle de acesso, criptografia de senha, configuração e tratamento de erro. As três críticas (SQL concatenado, token de senha previsível e JWT fixo sem expiração) bastam, cada uma sozinha, para assumir contas da aplicação. A correção proposta ataca essas três primeiro e deixa o código atual intacto até o grupo registrar a evidência dinâmica e aplicar os patches numa cópia de reteste.

## Referências

- OWASP Top 10:2025 — https://owasp.org/Top10/2025/
- OWASP Web Security Testing Guide — https://owasp.org/www-project-web-security-testing-guide/
- FIRST CVSS v3.1 — https://www.first.org/cvss/v3.1/specification-document
- Calculadora CVSS 3.1 — https://www.first.org/cvss/calculator/3.1
- OWASP Cheat Sheet Series (SQL Injection, XSS Prevention, Authorization, Forgot Password, JWT)
- CWE-89, CWE-79, CWE-200, CWE-209, CWE-613, CWE-639, CWE-640, CWE-798, CWE-862, CWE-915, CWE-916, CWE-942
