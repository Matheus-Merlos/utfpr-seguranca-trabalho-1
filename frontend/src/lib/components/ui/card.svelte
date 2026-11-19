<script lang="ts" module>
  export { default as CardHeader } from './card-header.svelte';
  export { default as CardTitle } from './card-title.svelte';
  export { default as CardDescription } from './card-description.svelte';
  export { default as CardContent } from './card-content.svelte';
  export { default as CardFooter } from './card-footer.svelte';
</script>

<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    children: Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<div class={cn('rounded-lg border bg-white shadow-sm', className)}>
  {@render children()}
</div>
