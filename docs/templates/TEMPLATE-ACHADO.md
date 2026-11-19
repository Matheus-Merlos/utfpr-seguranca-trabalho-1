# Ficha de Achado de Segurança

## Informações Gerais

| Campo | Valor |
|-------|-------|
| **ID** | ACH-XX |
| **Título** | [Nome descritivo da vulnerabilidade] |
| **Categoria OWASP Top 10:2025** | [Ex: A01 Broken Access Control] |
| **CWE** | [Ex: CWE-89 SQL Injection] |
| **Teste WSTG** | [Ex: WSTG-INPV-05 SQL Injection] |
| **Severidade** | [Crítica / Alta / Média / Baixa / Informativa] |
| **Vetor CVSS 3.1** | [Ex: AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N] |
| **Nota CVSS** | [0.0 - 10.0] |
| **Ativo Afetado** | [URL, endpoint ou componente] |
| **Responsável** | [Nome do auditor] |
| **Data** | [AAAA-MM-DD] |
| **Status** | [Aberto / Em correção / Corrigido / Validado] |

## Descrição

[Explicação técnica da vulnerabilidade. O que é, como funciona, por que existe.]

## Pré-condições

[Estado necessário para exploração. Ex: usuário autenticado, acesso à rede interna, etc.]

- [Pré-condição 1]
- [Pré-condição 2]

## Passos para Reproduzir

1. [Passo 1]
2. [Passo 2]
3. [Passo 3]
4. [Passo N]

## Payloads Utilizados

```
[Código ou entrada maliciosa utilizada]
```

## Evidências

| Arquivo | Descrição |
|---------|-----------|
| `ev01-descricao.png` | [O que a imagem mostra] |
| `ev02-descricao.png` | [O que a imagem mostra] |
| `ev03-burp-request.png` | [Request capturado no Burp] |
| `ev04-burp-response.png` | [Response capturado no Burp] |

## Impacto

[Consequências concretas da exploração. Seja específico sobre o que um atacante poderia fazer.]

## Recomendação

[Como corrigir a vulnerabilidade. Boas práticas e referências.]

## Correção Aplicada

### Código Antes

```typescript
// Código vulnerável
```

### Código Depois

```typescript
// Código corrigido
```

**Pull Request:** [Link para o PR]

## Reteste

### Reteste Local

- **Data:** [AAAA-MM-DD]
- **Resultado:** [Passou / Falhou]
- **Evidência:** `evXX-reteste-local.png`

### Reteste Pós-Deploy

- **Data:** [AAAA-MM-DD]
- **Resultado:** [Passou / Falhou]
- **Evidência:** `evXX-reteste-prod.png`

---

## Critério de Aceite (Checklist)

Antes de submeter, verifique:

- [ ] Vulnerabilidade é reproduzível apenas seguindo os passos documentados
- [ ] Vetor CVSS 3.1 está completo (todas as 8 métricas base)
- [ ] Há no mínimo 2 screenshots com URL visível na barra do navegador
- [ ] Request e response do Burp estão incluídos nas evidências
- [ ] Impacto concreto está descrito (não genérico)
- [ ] PR de correção está linkado
- [ ] Reteste local foi realizado e documentado
- [ ] Reteste pós-deploy foi realizado e documentado

---

# Exemplo Preenchido (Aplicação Fictícia)

> **ATENÇÃO:** Este exemplo usa uma aplicação fictícia chamada "loja-exemplo".
> Substitua todos os dados pelo achado real que você está documentando.

## Informações Gerais

| Campo | Valor |
|-------|-------|
| **ID** | ACH-01 |
| **Título** | SQL Injection no login permite bypass de autenticação |
| **Categoria OWASP Top 10:2025** | A03 Injection |
| **CWE** | CWE-89 Improper Neutralization of Special Elements used in an SQL Command |
| **Teste WSTG** | WSTG-INPV-05 Testing for SQL Injection |
| **Severidade** | Crítica |
| **Vetor CVSS 3.1** | AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N |
| **Nota CVSS** | 9.1 |
| **Ativo Afetado** | https://loja-exemplo.com/api/auth/login |
| **Responsável** | João Silva |
| **Data** | 2024-03-15 |
| **Status** | Validado |

## Descrição

O endpoint de login da aplicação loja-exemplo concatena diretamente o input do usuário na query SQL sem sanitização. Isso permite que um atacante injete código SQL malicioso no campo de usuário, bypassando completamente a autenticação e acessando a aplicação como qualquer usuário, incluindo administradores.

## Pré-condições

- Acesso à página de login da aplicação
- Nenhuma autenticação prévia necessária

## Passos para Reproduzir

1. Acessar https://loja-exemplo.com/login
2. No campo "Usuário", inserir o payload: `' OR '1'='1' --`
3. No campo "Senha", inserir qualquer valor (ex: `x`)
4. Clicar no botão "Entrar"
5. Observar que o login é realizado com sucesso como o primeiro usuário do banco (geralmente admin)

## Payloads Utilizados

```sql
' OR '1'='1' --
```

Variações testadas:
```sql
' OR 1=1 --
admin'--
' UNION SELECT * FROM usuarios --
```

## Evidências

| Arquivo | Descrição |
|---------|-----------|
| `ev01-tela-login.png` | Tela de login com payload inserido |
| `ev02-dashboard-admin.png` | Dashboard administrativo após bypass |
| `ev03-burp-request.png` | Request POST capturado no Burp Proxy |
| `ev04-burp-response.png` | Response 200 OK com token JWT |

## Impacto

Um atacante não autenticado pode:
- Acessar a aplicação como administrador
- Visualizar dados de todos os clientes (nome, CPF, endereço, histórico de compras)
- Modificar preços de produtos
- Excluir pedidos ou contas de usuários
- Extrair todo o banco de dados usando técnicas de UNION-based injection

## Recomendação

1. Utilizar queries parametrizadas (prepared statements) em vez de concatenação de strings
2. Implementar validação de input no servidor
3. Aplicar princípio de menor privilégio no usuário do banco de dados
4. Considerar uso de ORM com proteção contra SQLi

**Referências:**
- https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- https://cwe.mitre.org/data/definitions/89.html

## Correção Aplicada

### Código Antes

```typescript
const query = `SELECT * FROM usuarios WHERE username = '${username}' AND senha = '${senha}'`;
const result = await db.query(query);
```

### Código Depois

```typescript
const query = 'SELECT * FROM usuarios WHERE username = $1 AND senha = $2';
const result = await db.query(query, [username, senha]);
```

**Pull Request:** https://github.com/exemplo/loja-exemplo/pull/42

## Reteste

### Reteste Local

- **Data:** 2024-03-18
- **Resultado:** Passou
- **Evidência:** `ev05-reteste-local.png`

O payload `' OR '1'='1' --` agora retorna erro de credenciais inválidas.

### Reteste Pós-Deploy

- **Data:** 2024-03-19
- **Resultado:** Passou
- **Evidência:** `ev06-reteste-prod.png`

Testado em produção após deploy. Vulnerabilidade corrigida.

---

## Critério de Aceite (Checklist)

- [x] Vulnerabilidade é reproduzível apenas seguindo os passos documentados
- [x] Vetor CVSS 3.1 está completo (todas as 8 métricas base)
- [x] Há no mínimo 2 screenshots com URL visível na barra do navegador
- [x] Request e response do Burp estão incluídos nas evidências
- [x] Impacto concreto está descrito (não genérico)
- [x] PR de correção está linkado
- [x] Reteste local foi realizado e documentado
- [x] Reteste pós-deploy foi realizado e documentado
