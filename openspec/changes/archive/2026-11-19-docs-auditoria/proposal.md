## Why

O grupo precisa de uma estrutura padronizada para documentar os achados da auditoria de segurança e gerar o relatório final. Os templates garantem consistência entre os membros, facilitam a revisão por pares e atendem aos critérios de avaliação do trabalho. A documentação será pública, então não pode conter referências ao catálogo interno de falhas.

## What Changes

- Criar template de ficha de achado com todos os campos exigidos (OWASP, CWE, CVSS 3.1, evidências, correção)
- Criar template do relatório final com estrutura profissional (sumário executivo, metodologia, achados, correções)
- Criar guia rápido de CVSS 3.1 para padronizar a classificação de severidade
- Criar estrutura de pastas organizada por categoria de achado e tipo de evidência
- Criar template de PR para correções de segurança
- Incluir exemplos preenchidos usando aplicação fictícia ("loja-exemplo"), nunca o SIGAcad

## Capabilities

### New Capabilities

- `templates-achado`: Template padronizado para documentar vulnerabilidades encontradas, com campos OWASP Top 10:2025, CWE, WSTG, CVSS 3.1, evidências e critério de aceite
- `templates-relatorio`: Estrutura do relatório final de auditoria com sumário executivo, metodologia, achados e recomendações
- `guia-cvss`: Guia de referência rápida para classificação CVSS 3.1
- `estrutura-docs`: Estrutura de pastas para organizar achados, scans e relatório final
- `template-pr`: Template de pull request para correções de segurança

### Modified Capabilities

(nenhuma - este change cria apenas documentação nova)

## Impact

- Cria pasta `docs/` com templates e estrutura de diretórios
- Cria `.github/pull_request_template.md`
- Não altera código da aplicação
- Documentação pública: nenhum arquivo pode mencionar VULN-XX, endpoints vulneráveis específicos ou payloads funcionais do SIGAcad
