## Why

Este é o primeiro change do SIGAcad. Precisamos da estrutura base do projeto — monorepo com backend NestJS, frontend Svelte 5, docker-compose com PostgreSQL — e das configurações globais que servirão de fundação para os próximos changes.

## What Changes

- Criar estrutura monorepo: `backend/` (NestJS + TypeORM), `frontend/` (Svelte 5 + Vite), `docker-compose.yml`
- Definir entidades de domínio: Usuario, Disciplina, Matricula, Nota, Recado
- Seed com dados fictícios: 1 admin, 3 professores, ~20 alunos, ~8 disciplinas, notas e recados
- Configurar CORS refletindo qualquer Origin com `credentials: true`
- Expor Swagger público em `/api/docs`
- Adicionar lodash 4.17.15 como dependência e usá-lo em algum utilitário
- Criar exception filter global que expõe stack trace e queries SQL em erros
- Não configurar helmet (ausência de headers de segurança)
- Não configurar logging estruturado (ausência proposital)

## Vulnerabilidades implementadas

- **VULN-13** [A02] CORS refletindo qualquer Origin com `credentials: true`
- **VULN-14** [A02] Swagger público; seed com admin/admin; sem helmet
- **VULN-15** [A03] lodash fixado em 4.17.15 (CVEs conhecidos)
- **VULN-16** [A09] Nenhum log de operações sensíveis
- **VULN-17** [A10] Exception filter devolve message, stack e query SQL

## Fora de escopo

- Autenticação e login (change `auth-e-perfis`)
- Endpoints de disciplinas, boletim, notas e mural (change `nucleo-academico`)
- Infraestrutura Terraform (change `infra`)

## Capabilities

### New Capabilities

- `estrutura-projeto`: Monorepo com backend NestJS, frontend Svelte 5, docker-compose com PostgreSQL
- `entidades-seed`: Entidades de domínio (Usuario, Disciplina, Matricula, Nota, Recado) e seed com dados fictícios
- `configuracao-api`: CORS, Swagger, exception filter global, dependência lodash, ausência de helmet e logging

### Modified Capabilities

(nenhuma — projeto novo)

## Impact

- Cria toda a estrutura de diretórios do projeto
- Define o schema do banco de dados
- Estabelece padrões de configuração que os próximos changes herdam
- lodash 4.17.15 aparecerá em `npm audit` como vulnerável
