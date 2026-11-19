# Proposal: Adicionar endpoint de listagem de usuários

## Problema

A página de administração de usuários (`AdminUsuarios.svelte`) chama `GET /api/usuarios` para listar todos os usuários do sistema, mas esse endpoint não existe no backend. O controller de usuários (`usuarios.controller.ts`) só possui endpoints para o próprio usuário autenticado (`GET /me` e `PATCH /me`).

Erro retornado:
```
404 Not Found - Cannot GET /api/usuarios
```

## Solução

Adicionar os endpoints necessários para gerenciamento de usuários pelo admin:

1. `GET /api/usuarios` - Listar todos os usuários
2. `PATCH /api/usuarios/:id` - Atualizar qualquer usuário
3. `DELETE /api/usuarios/:id` - Deletar um usuário

## Escopo

- Backend apenas
- Não adicionar verificação de role (seguindo padrão existente onde endpoints são protegidos apenas por autenticação)
