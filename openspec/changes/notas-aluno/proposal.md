# Proposal: Corrigir clique nos cards de disciplina

## Problema

Na página de Lançamento de Notas, clicar no card da disciplina não funciona. O `onclick` está sendo passado para `CardContent`, mas esse componente não repassa eventos - ele só aceita `class` e `children`.

```svelte
<CardContent class="p-4" onclick={() => selecionarDisciplina(disc)}>
```

O `onclick` é ignorado porque `CardContent` não tem `...restProps`.

## Solução

Duas opções:
1. Modificar `CardContent` para aceitar e repassar eventos (`onclick`, etc)
2. Mover o `onclick` para um wrapper `<button>` dentro do card

A opção 1 é mais limpa e resolve para outros casos também.
