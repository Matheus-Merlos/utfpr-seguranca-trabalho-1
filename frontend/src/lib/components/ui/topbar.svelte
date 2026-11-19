<script lang="ts">
  import { cn } from '$lib/utils';
  import { LogOut, Menu } from 'lucide-svelte';
  import Avatar from './avatar.svelte';
  import Button from './button.svelte';

  interface Props {
    user: { nomeExibicao: string; role: string } | null;
    onLogout: () => void;
    onMenuClick?: () => void;
    class?: string;
  }

  let { user, onLogout, onMenuClick, class: className = '' }: Props = $props();
</script>

<header class={cn('flex h-16 items-center justify-between border-b bg-white px-6', className)}>
  <div class="flex items-center gap-4">
    {#if onMenuClick}
      <Button variant="ghost" size="icon" class="lg:hidden" onclick={onMenuClick}>
        <Menu class="h-5 w-5" />
      </Button>
    {/if}
    <div class="hidden lg:block">
      <h1 class="text-lg font-semibold">SIGAcad</h1>
    </div>
  </div>

  {#if user}
    <div class="flex items-center gap-4">
      <div class="hidden sm:block text-right">
        <p class="text-sm font-medium">{user.nomeExibicao}</p>
        <p class="text-xs text-muted-foreground">{user.role}</p>
      </div>
      <Avatar fallback={user.nomeExibicao} size="sm" />
      <Button variant="ghost" size="icon" onclick={onLogout}>
        <LogOut class="h-5 w-5" />
      </Button>
    </div>
  {/if}
</header>
