<script lang="ts">
  import { cn } from '$lib/utils';
  import { X } from 'lucide-svelte';

  interface Props {
    open: boolean;
    onClose?: () => void;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { open = $bindable(), onClose, class: className = '', children }: Props = $props();

  function handleBackdropClick() {
    open = false;
    onClose?.();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      open = false;
      onClose?.();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div
      class="fixed inset-0 bg-black/50"
      onclick={handleBackdropClick}
      onkeydown={(e) => e.key === 'Enter' && handleBackdropClick()}
      role="button"
      tabindex="-1"
    ></div>
    <div
      class={cn(
        'relative z-50 w-full max-w-lg rounded-lg border bg-white p-6 shadow-lg',
        className
      )}
      role="dialog"
      aria-modal="true"
    >
      <button
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onclick={() => { open = false; onClose?.(); }}
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Fechar</span>
      </button>
      {@render children?.()}
    </div>
  </div>
{/if}
