<script lang="ts">
  import { auth } from '$lib/stores/auth';
  import { Card, CardHeader, CardTitle, CardContent, Badge, Skeleton } from '$lib/components/ui';
  import { BookOpen, Search, MessageSquare, User, Settings, GraduationCap, Users } from 'lucide-svelte';

  let user = $derived($auth.user);

  const quickLinks = {
    ALUNO: [
      { icon: GraduationCap, label: 'Boletim', description: 'Visualize suas notas', href: '/boletim', color: 'bg-blue-500' },
      { icon: Search, label: 'Disciplinas', description: 'Buscar disciplinas', href: '/busca', color: 'bg-green-500' },
      { icon: MessageSquare, label: 'Mural', description: 'Recados e avisos', href: '/mural', color: 'bg-amber-500' },
      { icon: User, label: 'Perfil', description: 'Editar seus dados', href: '/perfil', color: 'bg-purple-500' },
    ],
    PROFESSOR: [
      { icon: BookOpen, label: 'Lançar Notas', description: 'Gerenciar notas', href: '/notas', color: 'bg-blue-500' },
      { icon: Search, label: 'Disciplinas', description: 'Suas disciplinas', href: '/busca', color: 'bg-green-500' },
      { icon: MessageSquare, label: 'Mural', description: 'Postar avisos', href: '/mural', color: 'bg-amber-500' },
      { icon: User, label: 'Perfil', description: 'Editar seus dados', href: '/perfil', color: 'bg-purple-500' },
    ],
    ADMIN: [
      { icon: Users, label: 'Usuários', description: 'Gerenciar usuários', href: '/admin/usuarios', color: 'bg-blue-500' },
      { icon: BookOpen, label: 'Disciplinas', description: 'Todas as disciplinas', href: '/busca', color: 'bg-green-500' },
      { icon: MessageSquare, label: 'Mural', description: 'Recados e avisos', href: '/mural', color: 'bg-amber-500' },
      { icon: Settings, label: 'Configurações', description: 'Sistema', href: '/perfil', color: 'bg-purple-500' },
    ],
  };

  const links = $derived(quickLinks[user?.role as keyof typeof quickLinks] || quickLinks.ALUNO);
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-2xl font-bold">Dashboard</h1>
    {#if user}
      <p class="text-muted-foreground">
        Bem-vindo, <span class="font-medium text-foreground">{user.nomeExibicao}</span>
      </p>
    {/if}
  </div>

  {#if user}
    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{user.role}</div>
          <p class="text-xs text-muted-foreground">Nível de acesso</p>
        </CardContent>
      </Card>

      {#if user.role === 'ALUNO'}
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground">Disciplinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">-</div>
            <p class="text-xs text-muted-foreground">Matriculado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground">Média Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">-</div>
            <p class="text-xs text-muted-foreground">Este semestre</p>
          </CardContent>
        </Card>
      {:else}
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground">Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="success">Online</Badge>
            <p class="text-xs text-muted-foreground mt-1">Funcionando normalmente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground">Versão</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">1.0</div>
            <p class="text-xs text-muted-foreground">SIGAcad</p>
          </CardContent>
        </Card>
      {/if}
    </div>

    <!-- Quick Links -->
    <div>
      <h2 class="text-lg font-semibold mb-4">Acesso Rápido</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each links as link}
          {@const Icon = link.icon}
          <a
            href={`#${link.href}`}
            class="group relative overflow-hidden rounded-lg border bg-white p-6 transition-all hover:shadow-lg hover:border-primary/20"
          >
            <div class="flex items-start justify-between">
              <div class={`rounded-lg p-2 ${link.color} text-white`}>
                <Icon class="h-5 w-5" />
              </div>
            </div>
            <h3 class="mt-4 font-semibold group-hover:text-primary transition-colors">
              {link.label}
            </h3>
            <p class="text-sm text-muted-foreground">
              {link.description}
            </p>
          </a>
        {/each}
      </div>
    </div>
  {:else}
    <!-- Loading State -->
    <div class="grid gap-4 md:grid-cols-3">
      {#each [1, 2, 3] as _}
        <Card>
          <CardHeader class="pb-2">
            <Skeleton class="h-4 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-8 w-16 mb-1" />
            <Skeleton class="h-3 w-24" />
          </CardContent>
        </Card>
      {/each}
    </div>
  {/if}
</div>
