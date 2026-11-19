# Design: Endpoint de alunos por disciplina

## Backend

### `disciplinas.controller.ts`

Adicionar endpoint:

```typescript
@Get(':id/alunos')
async getAlunos(@Param('id') id: string) {
  return this.disciplinasService.getAlunos(id);
}
```

### `disciplinas.service.ts`

Adicionar método que retorna matrículas com aluno e notas:

```typescript
async getAlunos(disciplinaId: string) {
  const matriculas = await this.matriculaRepository.find({
    where: { disciplinaId },
    relations: ['aluno', 'notas'],
  });
  
  return matriculas.map(m => ({
    alunoId: m.aluno.id,
    nomeExibicao: m.aluno.nomeExibicao,
    matriculaId: m.id,
    nota1: m.notas?.[0]?.nota1,
    nota2: m.notas?.[0]?.nota2,
    notaFinal: m.notas?.[0]?.notaFinal,
  }));
}
```

### `disciplinas.module.ts`

Importar `Matricula` entity no módulo.

## Frontend

### `dialog.svelte`

Adicionar `onkeydown` no backdrop div para suprimir o warning de a11y:

```svelte
<div
  class="fixed inset-0 bg-black/50"
  onclick={handleBackdropClick}
  onkeydown={(e) => e.key === 'Escape' && handleBackdropClick()}
  role="presentation"
></div>
```
