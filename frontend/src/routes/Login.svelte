<script lang="ts">
  import { login } from '$lib/stores/auth';

  let username = $state('');
  let senha = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    loading = true;

    try {
      await login(username, senha);
      window.location.href = '/';
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<main>
  <h1>Login</h1>

  <form onsubmit={handleSubmit}>
    {#if error}
      <p class="error">{error}</p>
    {/if}

    <label>
      Usuário
      <input type="text" bind:value={username} required />
    </label>

    <label>
      Senha
      <input type="password" bind:value={senha} required />
    </label>

    <button type="submit" disabled={loading}>
      {loading ? 'Entrando...' : 'Entrar'}
    </button>
  </form>

  <p><a href="/recuperar-senha">Esqueci minha senha</a></p>
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
  .error {
    color: red;
    padding: 0.5rem;
    background: #fee;
    border-radius: 4px;
  }
</style>
