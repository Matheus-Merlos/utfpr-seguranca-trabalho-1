<script lang="ts">
  import { cn } from '$lib/utils';
  import { X } from 'lucide-svelte';
  import Button from './button.svelte';
  import Sidebar from './sidebar.svelte';

  interface Props {
    open: boolean;
    role: string;
    currentPath: string;
    onClose: () => void;
  }

  let { open, role, currentPath, onClose }: Props = $props();
</script>

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-40 bg-black/50 lg:hidden"
    onclick={onClose}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
    role="button"
    tabindex="0"
  ></div>

  <!-- Menu -->
  <div class="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
    <div class="relative h-full">
      <Sidebar {role} {currentPath} />
      <Button
        variant="ghost"
        size="icon"
        class="absolute right-2 top-4"
        onclick={onClose}
      >
        <X class="h-5 w-5" />
      </Button>
    </div>
  </div>
{/if}
