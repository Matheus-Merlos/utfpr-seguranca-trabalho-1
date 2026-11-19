<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Component } from 'svelte';

  interface Props {
    icon?: Component;
    title: string;
    description?: string;
    class?: string;
  }

  let { icon: Icon, title, description, class: className = '' }: Props = $props();
</script>

<div class={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
  {#if Icon}
    <div class="mb-4 rounded-full bg-muted p-3">
      <Icon class="h-6 w-6 text-muted-foreground" />
    </div>
  {/if}
  <h3 class="text-lg font-semibold">{title}</h3>
  {#if description}
    <p class="mt-1 text-sm text-muted-foreground">{description}</p>
  {/if}
</div>
