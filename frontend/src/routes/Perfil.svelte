<script lang="ts">
  import { auth, checkAuth, logout } from '$lib/stores/auth';

  let nomeExibicao = $state('');
  let email = $state('');
  let message = $state('');
  let error = $state('');
  let loading = $state(false);

  let user = $derived($auth.user);

  $effect(() => {
    if (user) {
      nomeExibicao = user.nomeExibicao;
      email = user.email;
    }
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    message = '';
    loading = true;

    try {
      const res = await fetch('/api/usuarios/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nomeExibicao, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      message = 'Perfil atualizado com sucesso';
      await checkAuth();
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleLogout() {
    await logout();
    window.location.href = '/login';
  }
</script>

<main>
  <h1>Meu Perfil</h1>

  {#if user}
    <p>Olá, <strong>{user.nomeExibicao}</strong> ({user.role})</p>

    <form onsubmit={handleSubmit}>
      {#if error}
        <p class="error">{error}</p>
      {/if}
      {#if message}
        <p class="success">{message}</p>
      {/if}

      <label>
        Nome de Exibição
        <input type="text" bind:value={nomeExibicao} required />
      </label>

      <label>
        Email
        <input type="email" bind:value={email} required />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>

    <button class="logout" onclick={handleLogout}>Sair</button>
  {:else}
    <p>Carregando...</p>
  {/if}
</main>

<style>
  main {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    padding: 0.75rem;
    background: #1a365d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.6;
  }
  .logout {
    margin-top: 2rem;
    background: #c53030;
  }
  .error {
    color: red;
    padding: 0.5rem;
    background: #fee;
    border-radius: 4px;
  }
  .success {
    color: green;
    padding: 0.5rem;
    background: #efe;
    border-radius: 4px;
  }
</style>
