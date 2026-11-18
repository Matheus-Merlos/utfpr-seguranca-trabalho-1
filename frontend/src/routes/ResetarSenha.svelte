<script lang="ts">
  let token = $state('');
  let novaSenha = $state('');
  let confirmarSenha = $state('');
  let message = $state('');
  let error = $state('');
  let loading = $state(false);

  $effect(() => {
    const params = new URLSearchParams(window.location.search);
    token = params.get('token') || '';
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    message = '';

    if (novaSenha !== confirmarSenha) {
      error = 'As senhas não coincidem';
      return;
    }

    loading = true;

    try {
      const res = await fetch('/api/auth/resetar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      message = data.message;
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<main>
  <h1>Resetar Senha</h1>

  <form onsubmit={handleSubmit}>
    {#if error}
      <p class="error">{error}</p>
    {/if}
    {#if message}
      <p class="success">{message}</p>
    {/if}

    <label>
      Token
      <input type="text" bind:value={token} required />
    </label>

    <label>
      Nova Senha
      <input type="password" bind:value={novaSenha} required />
    </label>

    <label>
      Confirmar Senha
      <input type="password" bind:value={confirmarSenha} required />
    </label>

    <button type="submit" disabled={loading}>
      {loading ? 'Salvando...' : 'Salvar'}
    </button>
  </form>

  <p><a href="/login">Voltar ao login</a></p>
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
  .success {
    color: green;
    padding: 0.5rem;
    background: #efe;
    border-radius: 4px;
  }
</style>
