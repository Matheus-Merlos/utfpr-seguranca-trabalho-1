## 1. Templates de Documentação

- [x] 1.1 Criar `docs/templates/TEMPLATE-ACHADO.md` com todos os campos obrigatórios (ID, título, OWASP, CWE, WSTG, CVSS, evidências, correção, reteste, status)
- [x] 1.2 Adicionar critério de aceite em checklist ao final do template de achado
- [x] 1.3 Incluir exemplo completo preenchido usando "loja-exemplo" (SQL Injection fictício)
- [x] 1.4 Criar `docs/templates/TEMPLATE-RELATORIO.md` com todas as 11 seções (capa, sumário executivo, escopo, metodologia, severidade, tabela-resumo, achados, correções, limitações, conclusão, apêndices)
- [x] 1.5 Criar `docs/templates/GUIA-CVSS.md` com explicação das métricas, link da calculadora FIRST, faixas de severidade e 3 exemplos genéricos

## 2. Estrutura de Pastas para Achados

- [x] 2.1 Criar `docs/achados/ACH-01-sqli/` com README explicando que aqui vão achados de SQL Injection
- [x] 2.2 Criar `docs/achados/ACH-01-sqli/evidencias/` com .gitkeep
- [x] 2.3 Criar `docs/achados/ACH-02-xss/` com README para achados de Cross-Site Scripting
- [x] 2.4 Criar `docs/achados/ACH-02-xss/evidencias/` com .gitkeep
- [x] 2.5 Criar `docs/achados/ACH-03-access-control/` com README para achados de controle de acesso
- [x] 2.6 Criar `docs/achados/ACH-03-access-control/evidencias/` com .gitkeep
- [x] 2.7 Criar `docs/achados/ACH-04-auth-sessao/` com README para achados de autenticação e sessão
- [x] 2.8 Criar `docs/achados/ACH-04-auth-sessao/evidencias/` com .gitkeep

## 3. Estrutura de Pastas para Scans

- [x] 3.1 Criar `docs/scans/zap/README.md` explicando que aqui vão relatórios HTML/XML do OWASP ZAP
- [x] 3.2 Criar `docs/scans/burp/README.md` explicando que Burp Community não tem scanner automático: entregar histórico do proxy e prints manuais

## 4. Estrutura para Relatório Final

- [x] 4.1 Criar `docs/relatorio/README.md` instruindo a criar relatorio-final.md a partir do template

## 5. Template de Pull Request

- [x] 5.1 Criar `.github/pull_request_template.md` com campos: achado ACH-XX, o que foi corrigido, como validar (docker compose + payload + resultado), checklist de revisão

## 6. Verificação Final

- [x] 6.1 Executar grep para verificar que nenhum arquivo em docs/ contém padrões proibidos: "VULN-", "catálogo de falhas", "sigacad" (em contexto de vulnerabilidade)
- [x] 6.2 Revisar que todos os exemplos usam "loja-exemplo" e não o SIGAcad
- [x] 6.3 Verificar que todos os READMEs explicam claramente o que entregar em cada pasta
