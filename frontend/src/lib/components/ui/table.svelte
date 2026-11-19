<script lang="ts" module>
  export { default as TableHeader } from './table-header.svelte';
  export { default as TableBody } from './table-body.svelte';
  export { default as TableRow } from './table-row.svelte';
  export { default as TableHead } from './table-head.svelte';
  export { default as TableCell } from './table-cell.svelte';
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

<div class="relative w-full overflow-auto">
  <table class={cn('w-full caption-bottom text-sm', className)}>
    {@render children()}
  </table>
</div>
