<script lang="ts">
  import { auth, checkAuth, logout } from '$lib/stores/auth';
  import { LayoutShell, Skeleton } from '$lib/components/ui';
  import Login from './routes/Login.svelte';
  import RecuperarSenha from './routes/RecuperarSenha.svelte';
  import ResetarSenha from './routes/ResetarSenha.svelte';
  import Perfil from './routes/Perfil.svelte';
  import Dashboard from '$lib/pages/Dashboard.svelte';
  import Busca from '$lib/pages/Busca.svelte';
  import Boletim from '$lib/pages/Boletim.svelte';
  import Mural from '$lib/pages/Mural.svelte';
  import Notas from '$lib/pages/Notas.svelte';
  import AdminUsuarios from '$lib/pages/AdminUsuarios.svelte';

  let route = $state(window.location.hash.slice(1) || '/');
  let user = $derived($auth.user);
  let loading = $derived($auth.loading);

  $effect(() => {
    checkAuth();

    const handleHashChange = () => {
      route = window.location.hash.slice(1) || '/';
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  });

  function navigate(path: string) {
    window.location.hash = path;
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const publicRoutes = ['/login', '/recuperar-senha', '/resetar-senha'];
  const isPublicRoute = $derived(publicRoutes.some(r => route === r || route.startsWith(r)));
  const currentPath = $derived(route.split('?')[0]);
</script>

{#if loading}
  <div class="flex h-screen items-center justify-center bg-background">
    <div class="flex flex-col items-center gap-4">
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold animate-pulse">
        S
      </div>
      <Skeleton class="h-4 w-32" />
    </div>
  </div>
{:else if isPublicRoute}
  {#if route === '/login'}
    <Login />
  {:else if route === '/recuperar-senha'}
    <RecuperarSenha />
  {:else if route === '/resetar-senha'}
    <ResetarSenha />
  {/if}
{:else if user}
  <LayoutShell {user} currentPath={currentPath} onLogout={handleLogout}>
    {#if route === '/dashboard'}
      <Dashboard />
    {:else if route.startsWith('/busca')}
      <Busca />
    {:else if route === '/boletim'}
      <Boletim />
    {:else if route === '/mural'}
      <Mural />
    {:else if route === '/perfil'}
      <Perfil />
    {:else if route === '/notas'}
      <Notas />
    {:else if route === '/admin/usuarios'}
      <AdminUsuarios />
    {:else}
      <Dashboard />
    {/if}
  </LayoutShell>
{:else}
  <!-- Redirect to login if not authenticated -->
  <Login />
{/if}
