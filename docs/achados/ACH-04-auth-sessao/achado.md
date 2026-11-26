# ACH-04 — Falhas de autenticação e de sessão

## Informações Gerais

| Campo | Valor |
|-------|-------|
| **ID** | ACH-04 |
| **Título** | Redefinição de senha previsível, JWT com segredo fixo e sessão sem expiração |
| **Categoria OWASP Top 10:2025** | A07 Authentication Failures |
| **CWE** | CWE-640 Weak Password Recovery Mechanism for Forgotten Password; CWE-798 Use of Hard-coded Credentials; CWE-613 Insufficient Session Expiration |
| **Teste WSTG** | WSTG-ATHN-09 Testing for Weak Password Change or Reset Functionalities; WSTG-SESS-10 Testing JSON Web Tokens; WSTG-SESS-02 Testing for Cookies Attributes |
| **Severidade** | Crítica |
| **Vetor CVSS 3.1** | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H |
| **Nota CVSS** | 9.8 (JWT). A redefinição de senha, isolada, é 9.1 |
| **Ativo Afetado** | `POST /api/auth/recuperar-senha`, `POST /api/auth/resetar-senha`, emissão e verificação do JWT, cookie `token` |
| **Responsável** | Paulo Fontana |
| **Revisão inicial do grupo** | 21/11/2026 |
| **Status** | Correção local em revisão. A publicação depende da proteção de edição de e-mail do ACH-03. |

A nota do achado segue o pior item do conjunto, o JWT. Os itens são corrigidos por patches diferentes e por isso têm vetor próprio.

## Descrição

A revisão inicial do grupo examinou o código do commit `91b4d50`. As imagens ev01 a ev03 registram essa versão. A correção está na cópia local em revisão.

| Componente | Comportamento observado antes da correção | Impacto |
|---|---|---|
| Recuperação de senha | O código de recuperação era previsível e aparecia no log. O servidor aceitava a troca de senha sem conferir emissão, validade ou uso anterior. | Uma pessoa com acesso à API e conhecimento do e-mail cadastrado podia assumir a conta. |
| Sessão JWT | A chave de assinatura era fixa no repositório. A API aceitava sessões sem vencimento e o logout apenas apagava o cookie do navegador. | O servidor podia aceitar uma identidade indevida ou continuar aceitando uma credencial depois do logout. |
| Cookie de sessão | O cookie era emitido sem `HttpOnly` e sem `Secure`. | Um script na origem podia ler a credencial. O cookie também podia acompanhar uma requisição por HTTP. |
| Login e senhas | A aplicação armazenava um MD5 sem sal e distinguia “usuário não encontrado” de “senha incorreta”. As tentativas eram ilimitadas. | A resposta revelava a existência do usuário. O baixo custo do MD5 facilitava a descoberta de senhas caso os hashes fossem expostos, como descrito no ACH-05. |

## Pré-condições

Os vetores da ficha original pressupõem acesso à API pela rede, sem autenticação prévia. No caso da recuperação de senha, o impacto pressupõe conhecimento do e-mail cadastrado.

## Passos para Reproduzir

1. Para conferir a revisão original, consulte as três imagens do código listadas em **Evidências**. Elas mostram como a versão auditada tratava a recuperação de senha, o vencimento do JWT e a emissão do cookie.
2. Para repetir a validação da cópia corrigida, siga **Como estudar o fluxo localmente**. Use uma conta de laboratório e solicite a redefinição pelo formulário.
3. Entre com a nova senha e confirme o acesso ao seu perfil. A seção **Reteste Local** registra também o resultado do uso simultâneo do código e da invalidação da sessão anterior.

## Payloads Utilizados

O diagnóstico inicial foi feito por revisão de código. No reteste, a suíte usou credenciais sintéticas e códigos de recuperação de teste. As entradas e as verificações constam na [suíte de regressão](../../../backend/test/auth.test.cjs).

## Evidências

| Arquivo | Descrição |
|---------|-----------|
| [ev01-reset-token.png](evidencias/ev01-reset-token.png) | Código de recuperação previsível e ausência de verificação de validade |
| [ev02-jwt-segredo.png](evidencias/ev02-jwt-segredo.png) | Chave fixa de assinatura e configuração que ignora o vencimento |
| [ev03-cookie-flags.png](evidencias/ev03-cookie-flags.png) | Cookie de sessão emitido sem as proteções `HttpOnly` e `Secure` |
| [ev04-reteste-local.txt](evidencias/ev04-reteste-local.txt) | Saída da suíte executada com os arquivos selecionados para o ACH-04 |
| [ev05-perfil-autenticado.png](evidencias/ev05-perfil-autenticado.png) | Em 25/11, o navegador mostra o perfil de `lucas.ferreira` em `localhost:5173/api/auth/me` após o login com a nova senha. |
| [ev06-perfil-apos-logout.png](evidencias/ev06-perfil-apos-logout.png) | No mesmo endereço, após o logout, o corpo da resposta mostra `401 Unauthorized`. |
| [ev07-burp-cookie-original.txt](evidencias/ev07-burp-cookie-original.txt) | No histórico do Burp do grupo de 21/11, o item 11 registra um login com resposta 201. A linha `Set-Cookie` original traz `Path=/` e `SameSite=Lax`, sem `HttpOnly` ou `Secure`. O valor do cookie foi ocultado. |

## Impacto

Para a redefinição, o grupo atribuiu **9,1** (`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N`) pelo acesso aos dados e operações da conta. Para o JWT, atribuiu **9,8** (`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`), considerando o impacto das operações administrativas da versão auditada, inclusive a remoção de contas. Esses valores descrevem o impacto estimado antes da correção.

## Recomendação

Vincular a recuperação de senha a um código aleatório, temporário e de uso único, entregue ao e-mail da conta. Exigir uma chave de assinatura por ambiente, validar o vencimento das sessões e revogá-las no servidor quando a senha mudar ou o usuário sair.

## Correção Aplicada

- **Recuperação.** O servidor gera um código de 32 bytes aleatórios, envia-o ao e-mail cadastrado e guarda o SHA-256 e o vencimento no PostgreSQL. Um novo pedido substitui o anterior. Na troca de senha, um único `UPDATE` confere o hash e o prazo de 15 minutos, grava a nova senha, consome o código e revoga as sessões. Duas requisições simultâneas disputam o mesmo registro.
- **Sessão.** A API exige uma chave `JWT_SECRET` do ambiente, usa HS256 e emite JWTs com validade de 15 minutos. Cada autenticação confere a versão da sessão no banco e carrega o papel atual da conta. Logout e redefinição incrementam essa versão, encerrando todas as sessões da conta. O cookie usa `HttpOnly`, `SameSite=Lax` e `Secure` no modo de produção.
- **Senhas.** O scrypt usa sal aleatório por senha. Um login válido migra o hash MD5 legado com uma atualização condicional que preserva uma troca de senha concorrente. O seed mantém as credenciais demonstrativas no laboratório. Em produção, o seed gera senhas aleatórias, e as antigas senhas públicas de demonstração exigem recuperação por e-mail.
- **Login.** Usuário inexistente e senha incorreta recebem a mesma mensagem de credenciais inválidas. O limite de tentativas continua como recomendação.
- **Alteração de e-mail.** Ao salvar um e-mail no perfil, o serviço cancela o código de recuperação pendente. A atualização aceita os campos de perfil previstos e preserva os campos internos da sessão.

**Dependência para publicação.** A recuperação entrega o código ao endereço cadastrado. O grupo precisa integrar a autorização de edição de perfil do ACH-03 antes de disponibilizar esse fluxo no domínio público. Essa proteção impede que uma conta comum altere o endereço de outra pessoa. O login e a redefinição também usam o arquivo trabalhado no ACH-01; os responsáveis devem conciliar esses trechos na integração.

O fluxo principal está no [serviço de autenticação](../../../backend/src/auth/auth.service.ts). A [estratégia JWT](../../../backend/src/auth/jwt.strategy.ts) verifica a sessão a cada requisição protegida. A classificação segue a categoria de autenticação do OWASP. [OWASP A07:2025](https://top10.owasp.org/2025/A07_2025-Authentication_Failures/) · [Recuperação de senha](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) · [Armazenamento de senhas](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

### Código Antes

Estes eram os atributos do cookie de login na versão auditada.

```typescript
httpOnly: false,
secure: false,
```

### Código Depois

O login e o logout agora compartilham os seguintes atributos.

```typescript
httpOnly: true,
sameSite: 'lax',
secure: process.env.NODE_ENV === 'production',
```

**Pull request** — pendente de revisão e abertura por Paulo.

### Como estudar o fluxo localmente

1. Para usar o Compose de desenvolvimento, copie `.env.example` para `.env` se ainda não existir. Preencha `JWT_SECRET` com o valor de `node -p "require('node:crypto').randomBytes(32).toString('hex')"`.
2. Na raiz, execute `docker compose up -d --build`. Para popular um banco de laboratório vazio, execute `docker compose exec api npm run seed`.
3. Na tela de login local, abra **Esqueci minha senha** e solicite a recuperação de uma conta de teste. Abra a caixa do Mailpit em `http://127.0.0.1:8025`. Na aplicação, selecione **Já tenho um código**, cole o código recebido e escolha a nova senha.
4. Para rodar a [suíte de regressão](../../../backend/test/auth.test.cjs), use Node.js 20 ou superior e PostgreSQL em `127.0.0.1`. Configure `PGUSER`, `PGPASSWORD` e `PGPORT` para um usuário do laboratório com permissão de criar bancos. Dentro de `backend`, execute `npm ci` e `npm run test:auth`. A suíte cria e remove seu próprio banco e inicia uma caixa SMTP de teste em loopback.

Para um futuro deploy, a configuração do servidor precisa fornecer a chave JWT e um SMTP com TLS. As contas demonstrativas com endereços fictícios exigem caixas de laboratório ou provisionamento de endereços válidos. O patch usa a sincronização de esquema que já existe no projeto.

## Reteste

### Reteste Local

Em 25/11/2026, os sete testes do ACH-04 passaram em uma cópia com o conteúdo selecionado para o commit, usando a API NestJS, um banco PostgreSQL descartável e um servidor SMTP em loopback. [Saída da suíte local](evidencias/ev04-reteste-local.txt)

Em 25/11/2026, Paulo concluiu a recuperação de senha e entrou pelo navegador com o usuário `lucas.ferreira` no laboratório. As capturas ev05 e ev06 documentam o acesso ao próprio perfil com a sessão ativa e a resposta 401 depois de sair. A suíte automatizada também verifica a revogação do cookie anterior no servidor.

| Verificação | Resultado observado |
|---|---|
| Login e vencimento | A conta de teste recebeu um cookie com duração de 900 segundos. A API retornou 200 para a sessão válida e 401 com o relógio avançado além do vencimento. A emissão no modo de produção incluiu `Secure`, `HttpOnly` e `SameSite=Lax`. |
| Logout e rotação de chave | O cookie anterior recebeu 401 após o logout e também em um teste separado após reiniciar a API com outra chave. O novo login funcionou em ambos os casos. |
| Senhas existentes | A conta criada com hash legado passou a usar scrypt após um login válido. Senha incorreta e usuário inexistente receberam a mesma mensagem e o status 401. |
| Recuperação por e-mail | O SMTP recebeu dois códigos distintos. O banco continha o SHA-256 do último. Códigos substituídos, desconhecidos ou expirados receberam 400 e a senha anterior continuou válida. |
| Uso simultâneo | Dois pedidos de troca com o mesmo código retornaram 201 e 400. A senha nova funcionou, e a senha antiga e a sessão prévia foram recusadas. |
| Alteração de e-mail | Editar o e-mail cancelou o código pendente e manteve válida a sessão do próprio usuário. |

### Reteste Pós-Deploy

Pendente de publicação da correção pelo grupo.

## Critério de Aceite (Checklist)

- [ ] Confirmação dinâmica das falhas originais de redefinição e de assinatura do JWT. Para esses dois itens, a evidência disponível é a revisão do código. Os atributos do cookie original estão confirmados na captura ev07.
- [x] Vetores CVSS 3.1 completos.
- [x] Duas capturas com a URL visível na barra do navegador (ev05 e ev06).
- [x] Requisição e resposta capturadas no Burp, com credenciais ocultadas (ev07, versão original).
- [x] Impacto concreto descrito.
- [ ] Link do PR de correção.
- [x] Reteste local realizado e documentado.
- [ ] Reteste pós-deploy realizado e documentado.
