# Configuração da API

### Requirement: CORS permissivo [VULN-13]

A API DEVE aceitar requisições de qualquer origem, refletindo o header `Origin` da requisição na resposta `Access-Control-Allow-Origin`, com `credentials: true`.

#### Scenario: Requisição cross-origin de site arbitrário

- **WHEN** uma requisição é feita de `https://atacante.com` com header `Origin: https://atacante.com`
- **THEN** a resposta contém `Access-Control-Allow-Origin: https://atacante.com`
- **AND** a resposta contém `Access-Control-Allow-Credentials: true`

#### Scenario: Preflight OPTIONS de qualquer origem

- **WHEN** o browser envia `OPTIONS /api/qualquer-rota` com `Origin: https://evil.com`
- **THEN** a resposta tem status 204 ou 200
- **AND** contém os headers CORS permissivos

### Requirement: Swagger público [VULN-14]

A documentação Swagger DEVE estar acessível publicamente em `/api/docs` sem autenticação.

#### Scenario: Acessar Swagger sem autenticação

- **WHEN** `GET /api/docs` é requisitado sem headers de autenticação
- **THEN** a página do Swagger UI é retornada
- **AND** todos os endpoints estão documentados

#### Scenario: Acessar JSON do OpenAPI

- **WHEN** `GET /api/docs-json` é requisitado
- **THEN** o schema OpenAPI completo é retornado em JSON

### Requirement: Ausência de headers de segurança [VULN-14]

A API NÃO DEVE enviar headers de segurança padrão (helmet ausente):
- Sem `X-Content-Type-Options`
- Sem `X-Frame-Options`
- Sem `Strict-Transport-Security`
- Sem `X-XSS-Protection`

#### Scenario: Verificar ausência de headers de segurança

- **WHEN** qualquer requisição é feita à API
- **THEN** a resposta não contém header `X-Content-Type-Options`
- **AND** a resposta não contém header `X-Frame-Options`
- **AND** a resposta não contém header `Strict-Transport-Security`

### Requirement: lodash vulnerável [VULN-15]

O projeto DEVE ter lodash fixado na versão 4.17.15, que contém CVEs conhecidos de prototype pollution. A biblioteca DEVE ser usada em código real (não apenas instalada).

#### Scenario: npm audit detecta vulnerabilidade

- **WHEN** `npm audit` é executado no diretório `backend/`
- **THEN** lodash 4.17.15 é reportado como vulnerável
- **AND** CVE de prototype pollution é listado

#### Scenario: lodash é usado em código

- **WHEN** o código-fonte é analisado
- **THEN** existe pelo menos uma chamada a função do lodash (ex: `_.get`, `_.merge`)

### Requirement: Exception filter expõe detalhes [VULN-17]

O exception filter global DEVE retornar informações sensíveis em erros:
- `message`: mensagem da exceção
- `stack`: stack trace completo
- `query`: query SQL (quando o erro for de banco de dados)

#### Scenario: Erro genérico expõe stack trace

- **WHEN** uma exceção não tratada ocorre
- **THEN** a resposta JSON contém o campo `stack` com o stack trace completo

#### Scenario: Erro de banco expõe query SQL

- **WHEN** uma query SQL falha (ex: violação de constraint)
- **THEN** a resposta JSON contém o campo `query` com a query SQL que falhou
- **AND** a resposta contém `message` com a mensagem de erro do PostgreSQL

#### Scenario: Explorar erro para descobrir estrutura

- **WHEN** atacante envia payload malformado que causa erro de banco
- **THEN** a resposta revela nomes de tabelas e colunas no stack trace ou query

### Requirement: Ausência de logging estruturado [VULN-16]

O sistema NÃO DEVE ter logging de eventos de negócio. O NestJS terá logging básico de requisições HTTP, mas não haverá log de:
- Falhas de autenticação
- Alterações de notas
- Mudanças de perfil ou role

#### Scenario: Falha de login não é logada

- **WHEN** uma tentativa de login falha
- **THEN** não há entrada de log registrando o evento
- **AND** não há como auditar tentativas de brute force posteriormente

#### Scenario: Alteração de dados sensíveis não é logada

- **WHEN** uma nota é alterada ou um role é modificado
- **THEN** não há entrada de log registrando quem fez a alteração
- **AND** não há trilha de auditoria
