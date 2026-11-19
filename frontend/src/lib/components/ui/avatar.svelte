<script lang="ts">
  import { cn } from '$lib/utils';

  interface Props {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'sm' | 'md' | 'lg';
    class?: string;
  }

  let { src, alt = '', fallback = '', size = 'md', class: className = '' }: Props = $props();

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  function getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  let imageError = $state(false);
</script>

<div
  class={cn(
    'relative flex shrink-0 overflow-hidden rounded-full bg-muted',
    sizes[size],
    className
  )}
>
  {#if src && !imageError}
    <img
      {src}
      {alt}
      class="aspect-square h-full w-full object-cover"
      onerror={() => (imageError = true)}
    />
  {:else}
    <span class="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-medium">
      {fallback ? getInitials(fallback) : '?'}
    </span>
  {/if}
</div>
