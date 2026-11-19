# Tasks

## Backend

### Módulo Disciplinas

- [x] Criar `backend/src/disciplinas/disciplinas.module.ts` com imports do TypeORM
- [x] Criar `backend/src/disciplinas/disciplinas.service.ts` com método `buscar(termo)` que concatena o termo diretamente na query SQL LIKE
- [x] Criar `backend/src/disciplinas/disciplinas.controller.ts` com GET /api/disciplinas e GET /api/disciplinas/:id

### Módulo Boletim

- [x] Criar `backend/src/boletim/boletim.module.ts`
- [x] Criar `backend/src/boletim/boletim.service.ts` com método `getBoletim(alunoId)` que busca notas sem verificar propriedade
- [x] Criar `backend/src/boletim/boletim.controller.ts` com GET /api/alunos/:id/boletim usando apenas JwtAuthGuard (sem verificação de ownership)

### Módulo Notas

- [x] Criar `backend/src/notas/notas.module.ts`
- [x] Criar `backend/src/notas/dto/atualizar-nota.dto.ts` com campos nota1, nota2, notaFinal
- [x] Criar `backend/src/notas/notas.service.ts` com método `atualizar(id, dto)`
- [x] Criar `backend/src/notas/notas.controller.ts` com PATCH /api/notas/:id usando apenas JwtAuthGuard (sem @Roles)

### Módulo Mural

- [x] Criar `backend/src/mural/mural.module.ts`
- [x] Criar `backend/src/mural/dto/criar-recado.dto.ts` com campo conteudo
- [x] Criar `backend/src/mural/mural.service.ts` com métodos `listar()` e `criar(autorId, dto)`
- [x] Criar `backend/src/mural/mural.controller.ts` com GET e POST /api/mural

### Integração

- [x] Registrar módulos DisciplinasModule, BoletimModule, NotasModule, MuralModule no AppModule
- [x] Atualizar seed para criar disciplinas, matrículas, notas e recados de exemplo

## Frontend

### Páginas

- [x] Criar `frontend/src/lib/pages/Busca.svelte` com campo de busca e renderização de resultados; exibir termo buscado com {@html}
- [x] Criar `frontend/src/lib/pages/Boletim.svelte` com tabela de notas do aluno logado
- [x] Criar `frontend/src/lib/pages/Mural.svelte` com listagem de recados usando {@html} no conteudo e nomeExibicao do autor
- [x] Criar `frontend/src/lib/pages/Dashboard.svelte` com links para funcionalidades por perfil

### Integração

- [x] Adicionar rotas /busca, /boletim, /mural, /dashboard no App.svelte
- [x] Criar serviços de API para disciplinas, boletim e mural em `frontend/src/lib/api/`
