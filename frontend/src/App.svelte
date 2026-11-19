<script lang="ts">
  import { auth, checkAuth, logout } from '$lib/stores/auth';
  import Login from './routes/Login.svelte';
  import RecuperarSenha from './routes/RecuperarSenha.svelte';
  import ResetarSenha from './routes/ResetarSenha.svelte';
  import Perfil from './routes/Perfil.svelte';
  import Dashboard from '$lib/pages/Dashboard.svelte';
  import Busca from '$lib/pages/Busca.svelte';
  import Boletim from '$lib/pages/Boletim.svelte';
  import Mural from '$lib/pages/Mural.svelte';

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
</script>

<div class="app">
  <header>
    <h1><a href="#/">SIGAcad</a></h1>
    <nav>
      {#if user}
        <a href="#/dashboard">Dashboard</a>
        <a href="#/busca">Disciplinas</a>
        <a href="#/mural">Mural</a>
        <a href="#/perfil">Perfil</a>
        <button onclick={handleLogout}>Sair</button>
      {:else if !loading}
        <a href="#/login">Entrar</a>
      {/if}
    </nav>
  </header>

  <main>
    {#if loading}
      <p>Carregando...</p>
    {:else if route === '/login'}
      <Login />
    {:else if route === '/recuperar-senha'}
      <RecuperarSenha />
    {:else if route === '/resetar-senha'}
      <ResetarSenha />
    {:else if route === '/perfil'}
      {#if user}
        <Perfil />
      {:else}
        <p>Você precisa estar logado. <a href="#/login">Entrar</a></p>
      {/if}
    {:else if route === '/dashboard'}
      {#if user}
        <Dashboard />
      {:else}
        <p>Você precisa estar logado. <a href="#/login">Entrar</a></p>
      {/if}
    {:else if route.startsWith('/busca')}
      <Busca />
    {:else if route === '/boletim'}
      {#if user}
        <Boletim />
      {:else}
        <p>Você precisa estar logado. <a href="#/login">Entrar</a></p>
      {/if}
    {:else if route === '/mural'}
      {#if user}
        <Mural />
      {:else}
        <p>Você precisa estar logado. <a href="#/login">Entrar</a></p>
      {/if}
    {:else}
      <div class="home">
        <h2>Bem-vindo ao SIGAcad</h2>
        <p>Sistema de Gestão Acadêmica</p>
        {#if user}
          <p>Você está logado como <strong>{user.nomeExibicao}</strong> ({user.role})</p>
          <p><a href="#/dashboard">Ir para o Dashboard</a></p>
        {:else}
          <p><a href="#/login">Faça login</a> para continuar</p>
        {/if}
      </div>
    {/if}
  </main>
</div>

<style>
  .app {
    font-family: system-ui, sans-serif;
    min-height: 100vh;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #1a365d;
    color: white;
  }
  header h1 {
    margin: 0;
    font-size: 1.5rem;
  }
  header h1 a {
    color: white;
    text-decoration: none;
  }
  nav {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  nav a {
    color: white;
    text-decoration: none;
  }
  nav button {
    background: transparent;
    border: 1px solid white;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
  }
  main {
    padding: 2rem;
  }
  .home {
    text-align: center;
    margin-top: 4rem;
  }
  .home h2 {
    color: #1a365d;
  }
</style>
