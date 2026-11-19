<script lang="ts">
  import { cn } from '$lib/utils';
  import { Home, BookOpen, Search, MessageSquare, User, ClipboardList, Users } from 'lucide-svelte';
  import type { Component } from 'svelte';

  interface NavItem {
    icon: Component;
    label: string;
    href: string;
  }

  interface Props {
    role: string;
    currentPath: string;
    class?: string;
  }

  let { role, currentPath, class: className = '' }: Props = $props();

  const navItems: Record<string, NavItem[]> = {
    ALUNO: [
      { icon: Home, label: 'Dashboard', href: '/dashboard' },
      { icon: BookOpen, label: 'Boletim', href: '/boletim' },
      { icon: Search, label: 'Disciplinas', href: '/busca' },
      { icon: MessageSquare, label: 'Mural', href: '/mural' },
      { icon: User, label: 'Perfil', href: '/perfil' },
    ],
    PROFESSOR: [
      { icon: Home, label: 'Dashboard', href: '/dashboard' },
      { icon: ClipboardList, label: 'Lançar Notas', href: '/notas' },
      { icon: Search, label: 'Disciplinas', href: '/busca' },
      { icon: MessageSquare, label: 'Mural', href: '/mural' },
      { icon: User, label: 'Perfil', href: '/perfil' },
    ],
    ADMIN: [
      { icon: Home, label: 'Dashboard', href: '/dashboard' },
      { icon: Users, label: 'Usuários', href: '/admin/usuarios' },
      { icon: BookOpen, label: 'Disciplinas', href: '/busca' },
      { icon: MessageSquare, label: 'Mural', href: '/mural' },
      { icon: User, label: 'Perfil', href: '/perfil' },
    ],
  };

  const items = $derived(navItems[role] || navItems.ALUNO);

  function isActive(href: string): boolean {
    return currentPath === href || currentPath.startsWith(href + '/');
  }
</script>

<aside class={cn('flex h-full w-64 flex-col border-r bg-white', className)}>
  <div class="flex h-16 items-center border-b px-6">
    <a href="#/dashboard" class="flex items-center gap-2">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
        S
      </div>
      <span class="text-lg font-semibold">SIGAcad</span>
    </a>
  </div>

  <nav class="flex-1 space-y-1 p-4">
    {#each items as item}
      {@const Icon = item.icon}
      {@const active = isActive(item.href)}
      <a
        href={`#${item.href}`}
        class={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          active
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
      >
        <Icon class="h-5 w-5" />
        {item.label}
      </a>
    {/each}
  </nav>
</aside>
