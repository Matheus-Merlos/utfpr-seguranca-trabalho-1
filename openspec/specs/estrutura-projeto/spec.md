# Estrutura do Projeto

### Requirement: Estrutura de diretórios do monorepo

O projeto DEVE ter a seguinte estrutura de diretórios:
- `backend/`: aplicação NestJS com TypeScript
- `frontend/`: aplicação Svelte 5 com Vite
- `docker-compose.yml`: orquestração de containers
- `.env.example`: template de variáveis de ambiente

#### Scenario: Verificar estrutura após clone

- **WHEN** desenvolvedor clona o repositório
- **THEN** os diretórios `backend/` e `frontend/` existem
- **AND** `docker-compose.yml` existe na raiz
- **AND** `.env.example` existe na raiz

### Requirement: Backend NestJS funcional

O backend DEVE ser uma aplicação NestJS válida com:
- TypeScript configurado
- TypeORM configurado para PostgreSQL
- Prefixo global `/api` em todas as rotas

#### Scenario: Backend inicia sem erros

- **WHEN** `npm run start:dev` é executado no diretório `backend/`
- **THEN** a aplicação inicia sem erros
- **AND** responde em `http://localhost:3000/api`

### Requirement: Frontend Svelte 5 funcional

O frontend DEVE ser uma aplicação Svelte 5 com Vite:
- Svelte 5 (com runes)
- Vite como bundler
- Configuração de proxy para `/api` apontando para o backend

#### Scenario: Frontend inicia sem erros

- **WHEN** `npm run dev` é executado no diretório `frontend/`
- **THEN** a aplicação inicia sem erros
- **AND** serve em `http://localhost:5173`

### Requirement: Docker Compose funcional

O `docker-compose.yml` DEVE definir três serviços:
- `postgres`: PostgreSQL 15+
- `api`: backend NestJS (com hot reload em dev)
- `front`: frontend Svelte (com hot reload em dev)

#### Scenario: Ambiente sobe com um comando

- **WHEN** `docker compose up --build` é executado na raiz
- **THEN** os três containers iniciam
- **AND** o frontend está acessível em `http://localhost:5173`
- **AND** a API está acessível em `http://localhost:3000/api`
- **AND** o banco de dados está acessível em `localhost:5432`

### Requirement: Variáveis de ambiente documentadas

O arquivo `.env.example` DEVE conter todas as variáveis necessárias com valores de exemplo:
- Conexão com PostgreSQL (host, porta, usuário, senha, banco)
- Porta da API
- Porta do frontend

#### Scenario: Desenvolvedor configura ambiente

- **WHEN** desenvolvedor copia `.env.example` para `.env`
- **THEN** a aplicação funciona com os valores padrão
- **AND** não é necessário editar nenhuma variável para ambiente local
