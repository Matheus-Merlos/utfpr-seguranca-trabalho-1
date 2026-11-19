# Proposal: Corrigir página de lançamento de notas

## Problemas

1. **Clique na disciplina não funciona**: O frontend chama `GET /api/disciplinas/:id/alunos` para listar alunos matriculados, mas esse endpoint não existe no backend.

2. **Warning de acessibilidade**: O componente `dialog.svelte` tem um `<div>` com `onclick` sem handler de teclado, gerando warning do Svelte.

## Solução

1. Criar endpoint `GET /api/disciplinas/:id/alunos` que retorna os alunos matriculados na disciplina com suas notas.

2. Corrigir o `dialog.svelte` adicionando handler de teclado no backdrop.

## Escopo

- Backend: adicionar endpoint em disciplinas.controller.ts
- Frontend: corrigir a11y no dialog.svelte
