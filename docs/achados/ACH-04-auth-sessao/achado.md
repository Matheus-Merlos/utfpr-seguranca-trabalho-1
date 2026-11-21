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
| **Vetor CVSS 3.1** | AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H |
| **Nota CVSS** | 9.8 (JWT). A redefinição de senha, isolada, é 9.1 |
| **Ativo Afetado** | `POST /api/auth/recuperar-senha`, `POST /api/auth/resetar-senha`, emissão e verificação do JWT, cookie `token` |
| **Responsável** | Grupo (preencher) |
| **Data** | 2026-11-21 |
| **Status** | Aberto — correção proposta, código do laboratório preservado |

A nota do achado segue o pior item do conjunto, o JWT. Os itens são corrigidos por patches diferentes e por isso têm vetor próprio.

## Descrição

### 4.1 Redefinição de senha (crítica, 9.1)

`recuperarSenha` monta o token com o e-mail e a data do dia, codificados em Base64. Não há segredo de servidor, aleatoriedade nem persistência. O valor é escrito no log do processo (`console.log`).

`resetarSenha` decodifica o token, separa no `:`, ignora a data e grava a nova senha no e-mail obtido. Não há consulta ao usuário antes de aceitar o token, nem comparação com um valor emitido. Qualquer cliente que conheça o formato produz um token aceito para um e-mail já cadastrado.

Vetor deste item: `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N` = **9.1**. A disponibilidade não entra neste item porque a ação direta é trocar a senha. A concatenação do e-mail no `UPDATE` é o ACH-01; aqui a falha permanece mesmo com SQL parametrizado.

A resposta de `recuperarSenha` é genérica (“Se o email existir…”). O defeito não é enumeração nessa frase. O defeito é o token.

### 4.2 JWT com segredo fixo e sem expiração (crítica, 9.8)

`JwtModule.register` e `JwtStrategy` usam o mesmo segredo literal `segredo123`. Não há `signOptions.expiresIn`. A estratégia define `ignoreExpiration: true`, então um campo `exp`, se existisse, seria ignorado.

Quem conhece o segredo — ele está no código-fonte — assina um token com `sub`, `username` e `role` de sua escolha. A API trata esse token como sessão. Não há lista de revogação. O logout só apaga o cookie no navegador; o token continua válido em outra chamada.

Vetor: `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` = **9.8**. Complexidade baixa porque o segredo não é derivado por máquina: está fixo no repositório. Integridade e disponibilidade altas porque o papel `ADMIN` no token passa a alcançar os métodos que só checam o JWT, inclusive a remoção de contas (ACH-03).

### 4.3 Cookie de sessão

O login grava `token` com `httpOnly: false`, `secure: false` e `sameSite: 'lax'`. O token não volta no JSON; volta no cookie. Sem `HttpOnly`, script da origem lê a credencial (relacionado ao ACH-02). Sem `Secure`, o navegador pode enviar o cookie em HTTP.

### 4.4 Hash de senha e mensagens de login

`hashSenha` usa MD5 sem sal. MD5 é rápido de testar offline e não é função de senha. O detalhe criptográfico está no ACH-06 junto da exposição dos hashes; a causa também é falha de autenticação (A04 Cryptographic Failures na lista 2025, além de A07).

O login responde “Usuário não encontrado” ou “Senha incorreta”. São duas consultas. Isso permite enumerar usuários (CWE-204). Severidade baixa diante dos itens 4.1 e 4.2. Não há limite de tentativas (CWE-307).

## Pré-condições

- API acessível.
- Para a redefinição: um e-mail que exista na base. O seed publica o e-mail do administrador no exemplo do DTO (`admin@sigacad.edu.br`).
- Para o JWT: o segredo do código e um endpoint com `JwtAuthGuard`.

## Confirmação

1. Ler `recuperarSenha` e `resetarSenha` e observar que a data não é verificada e que não existe segredo.
2. Ler `secretOrKey` e `ignoreExpiration` na estratégia JWT.
3. No laboratório, depois das correções, um token que o servidor não emitiu deve ser recusado, e um JWT assinado com o valor antigo também.

A ficha não traz um token pronto nem um JWT assinado.

## Evidências

| Arquivo | Descrição |
|---------|-----------|
| `evidencias/ev01-reset-token.png` | Token derivado de e-mail e data; a data não entra na verificação |
| `evidencias/ev02-jwt-segredo.png` | Segredo literal na emissão e na estratégia, com `ignoreExpiration: true` |
| `evidencias/ev03-cookie-flags.png` | Cookie `token` com `httpOnly: false` e `secure: false` |

## Impacto

A redefinição entrega a conta de qualquer e-mail conhecido, inclusive a do administrador do seed. O JWT fixo entrega uma sessão com o papel escolhido, sem passar pela senha, e essa sessão não expira. Os dois caminhos independem da injeção de SQL.

## Recomendação

- Emitir token de redefinição com `crypto.randomBytes`, guardar só o hash, com expiração curta e uso único. Não registrar o token em log.
- Recusar token ausente na base. Manter uma única mensagem externa.
- Ler `JWT_SECRET` do ambiente, obrigatório na subida. Assinar com expiração curta. Remover `ignoreExpiration`.
- Cookie: `httpOnly: true`, `secure: true` em HTTPS, `sameSite: 'lax'` ou `'strict'`.
- Trocar MD5 por senha com sal adaptativo (bcrypt, scrypt ou argon2). Ver ACH-06.
- Unificar a mensagem de falha de login e limitar tentativas por conta e por IP.

Referências: [OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html), [JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html), [CWE-640](https://cwe.mitre.org/data/definitions/640.html), [CWE-798](https://cwe.mitre.org/data/definitions/798.html).

## Correção Aplicada

Patches 2 e 3 em `docs/correcoes/PATCHES.md`. Não aplicados ao código do laboratório.

**Pull Request:** não aberto.

## Reteste

### Reteste previsto

- Token que não foi emitido e gravado pelo servidor recebe erro, e a senha do alvo não muda.
- Dois pedidos de recuperação do mesmo e-mail não produzem o mesmo token.
- O log do processo não contém o token.
- JWT assinado com `segredo123` recebe 401.
- Token expirado recebe 401.
- `Set-Cookie` inclui `HttpOnly`.
- Login válido ainda emite sessão e o logout encerra o uso daquele cookie.

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
