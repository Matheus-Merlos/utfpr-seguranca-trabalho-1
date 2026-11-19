## 1. Scaffold do backend

- [x] 1.1 Criar projeto NestJS em `backend/` com TypeScript
- [x] 1.2 Instalar e configurar TypeORM com driver PostgreSQL
- [x] 1.3 Configurar prefixo global `/api` no `main.ts`
- [x] 1.4 Instalar lodash fixado em 4.17.15 e criar utilitário que use `_.get()`
- [x] 1.5 Commit: `feat(backend): scaffold nestjs with typeorm`

## 2. Scaffold do frontend

- [x] 2.1 Criar projeto Svelte 5 com Vite em `frontend/`
- [x] 2.2 Configurar proxy de `/api` para `http://localhost:3000` no `vite.config.ts`
- [x] 2.3 Criar página inicial básica (placeholder)
- [x] 2.4 Commit: `feat(frontend): scaffold svelte 5 with vite`

## 3. Docker Compose

- [x] 3.1 Criar `docker-compose.yml` com serviços postgres, api e front
- [x] 3.2 Criar `.env.example` com variáveis de ambiente documentadas
- [x] 3.3 Configurar volumes para hot reload em dev
- [x] 3.4 Testar: `docker compose up --build` sobe os três containers
- [x] 3.5 Commit: `feat: add docker-compose for local development`

## 4. Entidades de domínio

- [x] 4.1 Criar entidade `Usuario` com campos: id, username, email, senha, nomeExibicao, role
- [x] 4.2 Criar entidade `Disciplina` com campos: id, codigo, nome, professorId
- [x] 4.3 Criar entidade `Matricula` com campos: id, alunoId, disciplinaId
- [x] 4.4 Criar entidade `Nota` com campos: id, matriculaId, tipo, valor
- [x] 4.5 Criar entidade `Recado` com campos: id, conteudo, dataHora, autorId, disciplinaId
- [x] 4.6 Configurar relações entre entidades no TypeORM
- [x] 4.7 Testar: migrations rodam sem erro
- [x] 4.8 Commit: `feat(backend): add domain entities`

## 5. Seed de dados

- [x] 5.1 Criar script de seed em `backend/src/database/seed.ts`
- [x] 5.2 Criar 1 admin (username: admin, senha: admin), 3 professores, ~20 alunos
- [x] 5.3 Criar ~8 disciplinas associadas aos professores
- [x] 5.4 Criar matrículas conectando alunos às disciplinas
- [x] 5.5 Criar notas para as matrículas
- [x] 5.6 Criar recados no mural
- [x] 5.7 Adicionar script `npm run seed` no package.json
- [x] 5.8 Testar: seed roda sem erro e dados aparecem no banco
- [x] 5.9 Commit: `feat(backend): add seed with sample data`

## 6. Configuração da API

- [x] 6.1 Configurar CORS refletindo qualquer Origin com `credentials: true`
- [x] 6.2 Instalar e configurar Swagger em `/api/docs` (público, sem auth)
- [x] 6.3 Criar `AllExceptionsFilter` que retorna message, stack e query SQL
- [x] 6.4 Registrar o exception filter globalmente no `main.ts`
- [x] 6.5 Verificar que helmet NÃO está instalado
- [x] 6.6 Commit: `feat(backend): configure cors, swagger and error handling`

## 7. Verificação das vulnerabilidades

- [x] 7.1 [VULN-13] Testar CORS: `curl -i -H "Origin: https://evil.com" http://localhost:3000/api` retorna `Access-Control-Allow-Origin: https://evil.com`
- [x] 7.2 [VULN-14] Testar Swagger: acessar `http://localhost:3000/api/docs` sem autenticação mostra a documentação
- [x] 7.3 [VULN-14] Testar headers: `curl -i http://localhost:3000/api` não retorna X-Content-Type-Options nem X-Frame-Options
- [x] 7.4 [VULN-14] Testar seed: usuário admin/admin existe no banco (login será testado no change auth-e-perfis)
- [x] 7.5 [VULN-15] Testar lodash: `cd backend && npm audit` lista CVE do lodash 4.17.15
- [x] 7.6 [VULN-16] Verificar ausência de logging: não há logger configurado para eventos de negócio
- [x] 7.7 [VULN-17] Testar exception filter: requisição que causa erro retorna JSON com `stack`
