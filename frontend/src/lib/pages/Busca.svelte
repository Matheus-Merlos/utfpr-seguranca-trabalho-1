<script lang="ts">
  import { buscarDisciplinas } from '$lib/api/disciplinas';

  let termo = $state('');
  let resultados = $state<any[]>([]);
  let buscado = $state('');
  let loading = $state(false);
  let error = $state('');

  $effect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const q = params.get('q');
    if (q) {
      termo = q;
      executarBusca();
    }
  });

  async function executarBusca() {
    loading = true;
    error = '';
    buscado = termo;
    try {
      resultados = await buscarDisciplinas(termo);
    } catch (e) {
      error = 'Erro ao buscar disciplinas';
    }
    loading = false;
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    window.location.hash = `/busca?q=${encodeURIComponent(termo)}`;
    executarBusca();
  }
</script>

<div class="busca">
  <h2>Buscar Disciplinas</h2>

  <form onsubmit={handleSubmit}>
    <input
      type="text"
      bind:value={termo}
      placeholder="Nome ou código da disciplina..."
    />
    <button type="submit">Buscar</button>
  </form>

  {#if buscado}
    <h3>Resultados para: {@html buscado}</h3>
  {/if}

  {#if loading}
    <p>Buscando...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if resultados.length > 0}
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Nome</th>
          <th>Professor</th>
        </tr>
      </thead>
      <tbody>
        {#each resultados as disc}
          <tr>
            <td>{disc.codigo}</td>
            <td>{disc.nome}</td>
            <td>{disc.professor?.nomeExibicao || disc.professorNome || '-'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else if buscado}
    <p>Nenhuma disciplina encontrada.</p>
  {/if}
</div>

<style>
  .busca {
    max-width: 800px;
    margin: 0 auto;
  }
  form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    padding: 0.5rem 1rem;
    background: #1a365d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 0.75rem;
    border: 1px solid #ddd;
    text-align: left;
  }
  th {
    background: #f5f5f5;
  }
  .error {
    color: red;
  }
</style>
