# Design: Endpoints de gerenciamento de usuários

## Arquivos a modificar

### `backend/src/usuarios/usuarios.controller.ts`

Adicionar três novos endpoints:

```typescript
@Get()
@UseGuards(JwtAuthGuard)
async findAll() {
  return this.usuariosService.findAll();
}

@Patch(':id')
@UseGuards(JwtAuthGuard)
async atualizar(@Param('id') id: string, @Body() dto: AtualizarPerfilDto) {
  return this.usuariosService.atualizar(id, dto);
}

@Delete(':id')
@UseGuards(JwtAuthGuard)
async remover(@Param('id') id: string) {
  return this.usuariosService.remover(id);
}
```

### `backend/src/usuarios/usuarios.service.ts`

Adicionar métodos:

```typescript
async findAll(): Promise<Usuario[]> {
  return this.usuariosRepository.find({
    select: ['id', 'username', 'email', 'nomeExibicao', 'role'],
  });
}

async remover(id: string): Promise<void> {
  await this.usuariosRepository.delete(id);
}
```

O método `atualizar` já existe e aceita um id como parâmetro.

## Notas

- Todos os endpoints protegidos por `JwtAuthGuard`
- Não há verificação de role (IDOR intencional por design)
- Reutilizar `AtualizarPerfilDto` existente para update
