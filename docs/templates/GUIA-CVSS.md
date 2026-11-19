# Guia Rápido - CVSS 3.1

## O que é CVSS?

O **Common Vulnerability Scoring System (CVSS)** é um padrão aberto para avaliar a severidade de vulnerabilidades de segurança. A versão 3.1 é a mais utilizada atualmente.

## Calculadora Oficial

**Use sempre a calculadora oficial do FIRST:**

🔗 https://www.first.org/cvss/calculator/3.1

---

## Métricas Base

O CVSS 3.1 possui 8 métricas base divididas em dois grupos:

### Métricas de Exploitabilidade

| Métrica | Sigla | Valores | Descrição |
|---------|-------|---------|-----------|
| **Attack Vector** | AV | N, A, L, P | De onde o ataque pode ser lançado |
| **Attack Complexity** | AC | L, H | Dificuldade para explorar |
| **Privileges Required** | PR | N, L, H | Privilégios necessários |
| **User Interaction** | UI | N, R | Se requer ação do usuário |

### Métricas de Impacto

| Métrica | Sigla | Valores | Descrição |
|---------|-------|---------|-----------|
| **Scope** | S | U, C | Se afeta outros componentes |
| **Confidentiality** | C | N, L, H | Impacto na confidencialidade |
| **Integrity** | I | N, L, H | Impacto na integridade |
| **Availability** | A | N, L, H | Impacto na disponibilidade |

---

## Detalhamento das Métricas

### Attack Vector (AV) - Vetor de Ataque

| Valor | Nome | Descrição |
|-------|------|-----------|
| **N** | Network | Atacante pode explorar pela rede (internet) |
| **A** | Adjacent | Requer acesso à mesma rede local (LAN, Wi-Fi) |
| **L** | Local | Requer acesso local à máquina (sessão, terminal) |
| **P** | Physical | Requer acesso físico ao dispositivo |

### Attack Complexity (AC) - Complexidade do Ataque

| Valor | Nome | Descrição |
|-------|------|-----------|
| **L** | Low | Exploração direta, sem condições especiais |
| **H** | High | Requer condições específicas (timing, configuração) |

### Privileges Required (PR) - Privilégios Necessários

| Valor | Nome | Descrição |
|-------|------|-----------|
| **N** | None | Sem autenticação necessária |
| **L** | Low | Usuário comum autenticado |
| **H** | High | Privilégios administrativos |

### User Interaction (UI) - Interação do Usuário

| Valor | Nome | Descrição |
|-------|------|-----------|
| **N** | None | Exploração automática, sem ação da vítima |
| **R** | Required | Vítima precisa clicar em link, abrir arquivo, etc. |

### Scope (S) - Escopo

| Valor | Nome | Descrição |
|-------|------|-----------|
| **U** | Unchanged | Impacto limitado ao componente vulnerável |
| **C** | Changed | Impacto se estende a outros componentes/sistemas |

### Confidentiality, Integrity, Availability (C, I, A)

| Valor | Nome | Descrição |
|-------|------|-----------|
| **N** | None | Sem impacto |
| **L** | Low | Impacto parcial (alguns dados, algumas funções) |
| **H** | High | Impacto total (todos os dados, perda completa) |

---

## Faixas de Severidade

| Severidade | Faixa | Cor sugerida |
|------------|-------|--------------|
| **Crítica** | 9.0 - 10.0 | 🔴 Vermelho |
| **Alta** | 7.0 - 8.9 | 🟠 Laranja |
| **Média** | 4.0 - 6.9 | 🟡 Amarelo |
| **Baixa** | 0.1 - 3.9 | 🟢 Verde |
| **Informativa** | 0.0 | ⚪ Cinza |

---

## Exemplos de Vetores

### Exemplo 1: SQL Injection Remoto sem Autenticação

**Cenário:** Aplicação web permite injeção SQL no login, acessível pela internet, sem necessidade de autenticação prévia. Permite ler e modificar todo o banco de dados.

```
CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N
```

| Métrica | Valor | Justificativa |
|---------|-------|---------------|
| AV | N (Network) | Acessível pela internet |
| AC | L (Low) | Payload simples, sem condições especiais |
| PR | N (None) | Não precisa estar logado |
| UI | N (None) | Não precisa de ação da vítima |
| S | U (Unchanged) | Afeta apenas o banco da aplicação |
| C | H (High) | Lê todos os dados do banco |
| I | H (High) | Pode modificar qualquer dado |
| A | N (None) | Não causa indisponibilidade |

**Nota CVSS: 9.1 (Crítica)**

---

### Exemplo 2: XSS Stored que Requer Autenticação

**Cenário:** Campo de comentário permite XSS armazenado. Atacante precisa estar logado para postar. Quando outro usuário visualiza, o script executa e pode roubar sessão.

```
CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N
```

| Métrica | Valor | Justificativa |
|---------|-------|---------------|
| AV | N (Network) | Acessível pela internet |
| AC | L (Low) | Basta inserir script no campo |
| PR | L (Low) | Precisa de conta de usuário comum |
| UI | R (Required) | Vítima precisa acessar a página |
| S | C (Changed) | Afeta o navegador da vítima (outro componente) |
| C | L (Low) | Acesso à sessão da vítima |
| I | L (Low) | Pode executar ações como a vítima |
| A | N (None) | Não causa indisponibilidade |

**Nota CVSS: 5.4 (Média)**

---

### Exemplo 3: Information Disclosure de Versão do Servidor

**Cenário:** Headers HTTP revelam versão exata do servidor web e framework. Informação útil para atacante, mas sem exploração direta.

```
CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N
```

| Métrica | Valor | Justificativa |
|---------|-------|---------------|
| AV | N (Network) | Visível em qualquer requisição HTTP |
| AC | L (Low) | Basta fazer uma requisição |
| PR | N (None) | Sem autenticação |
| UI | N (None) | Automático |
| S | U (Unchanged) | Apenas o servidor afetado |
| C | L (Low) | Informação limitada (versão) |
| I | N (None) | Não permite modificação |
| A | N (None) | Não causa indisponibilidade |

**Nota CVSS: 5.3 (Média)** - Embora pareça baixo risco, o CVSS considera o vetor. Na prática, muitas organizações classificam como "Baixa" ou "Informativa".

---

## Dicas Práticas

1. **Sempre justifique cada métrica** - Não chute valores. Pense no cenário real.

2. **Scope (S) é a mais confusa** - Use "Changed" quando o impacto sai do componente vulnerável (ex: XSS afeta o navegador do usuário, não o servidor).

3. **Não superestime nem subestime** - Seja honesto sobre a complexidade e o impacto real.

4. **Considere o pior caso realista** - Qual o máximo que um atacante poderia fazer?

5. **Documente a justificativa** - Revisores podem discordar; ter o raciocínio documentado ajuda.

---

## Referências

- [CVSS v3.1 Specification Document](https://www.first.org/cvss/v3.1/specification-document)
- [CVSS v3.1 User Guide](https://www.first.org/cvss/v3.1/user-guide)
- [CVSS Calculator](https://www.first.org/cvss/calculator/3.1)
