# Design: Corrigir CardContent para aceitar eventos

## Modificar `card-content.svelte`

Adicionar `onclick` e outros props com spread:

```svelte
<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    class?: string;
    children: Snippet;
  }

  let { class: className = '', children, ...restProps }: Props = $props();
</script>

<div class={cn('p-6 pt-0', className)} {...restProps}>
  {@render children()}
</div>
```

Isso permite que qualquer evento HTML (`onclick`, `onkeydown`, etc) seja repassado para o div.
