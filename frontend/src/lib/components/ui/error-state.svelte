<script lang="ts">
  import { cn } from '$lib/utils';
  import { AlertCircle } from 'lucide-svelte';
  import Button from './button.svelte';

  interface Props {
    title?: string;
    description?: string;
    onRetry?: () => void;
    class?: string;
  }

  let {
    title = 'Erro ao carregar',
    description = 'Ocorreu um erro ao carregar os dados.',
    onRetry,
    class: className = '',
  }: Props = $props();
</script>

<div class={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
  <div class="mb-4 rounded-full bg-destructive/10 p-3">
    <AlertCircle class="h-6 w-6 text-destructive" />
  </div>
  <h3 class="text-lg font-semibold">{title}</h3>
  <p class="mt-1 text-sm text-muted-foreground">{description}</p>
  {#if onRetry}
    <Button variant="outline" class="mt-4" onclick={onRetry}>
      Tentar novamente
    </Button>
  {/if}
</div>
