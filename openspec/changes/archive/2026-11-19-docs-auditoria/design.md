## Context

O trabalho de auditoria de segurança exige documentação padronizada para:
- Registrar cada vulnerabilidade encontrada de forma reproduzível
- Gerar relatório final profissional para avaliação
- Submeter correções via PR com evidências de antes/depois

A documentação será commitada em repositório público, portanto não pode conter:
- Referências ao catálogo interno (VULN-XX)
- Endpoints ou payloads específicos do SIGAcad
- Qualquer informação que revele as falhas plantadas antes da auditoria

Exemplos usarão uma aplicação fictícia chamada "loja-exemplo".

## Goals / Non-Goals

**Goals:**
- Criar templates reutilizáveis e completos para fichas de achado
- Padronizar a estrutura do relatório final conforme boas práticas de pentest
- Facilitar o cálculo e documentação de CVSS 3.1
- Organizar evidências (screenshots, requests/responses) de forma rastreável
- Automatizar verificação de que nenhum arquivo público vaza o catálogo

**Non-Goals:**
- Gerar relatórios automaticamente a partir dos achados
- Integrar com ferramentas de scan (ZAP, Burp) via API
- Criar sistema de gestão de vulnerabilidades

## Decisions

### 1. Estrutura de pastas por categoria OWASP

Organizar achados em pastas por categoria principal facilita navegação e garante cobertura:
- `ACH-01-sqli/` para injeção
- `ACH-02-xss/` para XSS
- `ACH-03-access-control/` para controle de acesso
- `ACH-04-auth-sessao/` para autenticação e sessão

**Alternativa descartada:** Pasta única com todos os achados - dificulta revisão por categoria.

### 2. Nomenclatura de evidências

Padrão `evXX-descricao.png` onde XX é sequencial dentro do achado:
- `ev01-tela-login.png`
- `ev02-burp-request.png`
- `ev03-resposta-erro.png`

**Alternativa descartada:** Timestamps no nome - dificulta ordenação lógica.

### 3. Critério de aceite como checklist

Incluir checklist no final de cada ficha de achado para auto-revisão antes de submeter:
- [ ] Reproduzível apenas pelos passos documentados
- [ ] Vetor CVSS 3.1 completo
- [ ] Mínimo 2 screenshots com URL visível
- [ ] Request/response do Burp incluídos
- [ ] Impacto concreto descrito
- [ ] PR de correção linkado
- [ ] Reteste local e pós-deploy documentados

### 4. Separação de scans ZAP vs Burp

- `docs/scans/zap/`: Relatórios HTML/XML do scanner automático
- `docs/scans/burp/`: Histórico do proxy e prints (Burp Community não tem scanner)

### 5. Exemplo fictício obrigatório

Template de achado inclui exemplo completo usando "loja-exemplo" para:
- Demonstrar o preenchimento correto
- Evitar que membros copiem e esqueçam de substituir dados reais

## Risks / Trade-offs

**[Risco] Membro commita referência ao catálogo acidentalmente**
→ Mitigação: Task final executa grep por padrões proibidos (VULN-, catálogo de falhas, etc.)

**[Risco] Templates muito extensos desestimulam preenchimento completo**
→ Trade-off aceito: Completude > brevidade para fins de avaliação acadêmica

**[Risco] Burp Community não gera relatório automático**
→ Mitigação: README explica que deve entregar histórico + prints manuais
