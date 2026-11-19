<script lang="ts">
  import { getRecados, criarRecado } from '$lib/api/mural';

  let recados = $state<any[]>([]);
  let novoRecado = $state('');
  let loading = $state(true);
  let enviando = $state(false);
  let error = $state('');

  $effect(() => {
    carregarRecados();
  });

  async function carregarRecados() {
    loading = true;
    error = '';
    try {
      recados = await getRecados();
    } catch (e) {
      error = 'Erro ao carregar recados';
    }
    loading = false;
  }

  async function enviarRecado(e: Event) {
    e.preventDefault();
    if (!novoRecado.trim()) return;

    enviando = true;
    try {
      await criarRecado(novoRecado);
      novoRecado = '';
      await carregarRecados();
    } catch (e) {
      error = 'Erro ao enviar recado';
    }
    enviando = false;
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleString('pt-BR');
  }
</script>

<div class="mural">
  <h2>Mural de Recados</h2>

  <form onsubmit={enviarRecado} class="novo-recado">
    <textarea
      bind:value={novoRecado}
      placeholder="Escreva um recado..."
      rows="3"
    ></textarea>
    <button type="submit" disabled={enviando}>
      {enviando ? 'Enviando...' : 'Publicar'}
    </button>
  </form>

  {#if loading}
    <p>Carregando...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if recados.length === 0}
    <p>Nenhum recado publicado.</p>
  {:else}
    <div class="lista-recados">
      {#each recados as recado}
        <div class="recado">
          <div class="recado-header">
            <span class="autor">{@html recado.autor.nomeExibicao}</span>
            <span class="data">{formatarData(recado.dataHora)}</span>
          </div>
          <div class="recado-conteudo">{@html recado.conteudo}</div>
          {#if recado.disciplina}
            <span class="tag">{recado.disciplina.nome}</span>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .mural {
    max-width: 700px;
    margin: 0 auto;
  }
  .novo-recado {
    margin-bottom: 2rem;
  }
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
  }
  .novo-recado button {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background: #1a365d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .novo-recado button:disabled {
    opacity: 0.6;
  }
  .lista-recados {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .recado {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fafafa;
  }
  .recado-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .autor {
    font-weight: bold;
    color: #1a365d;
  }
  .data {
    color: #666;
    font-size: 0.85rem;
  }
  .recado-conteudo {
    line-height: 1.5;
  }
  .tag {
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.25rem 0.5rem;
    background: #e2e8f0;
    border-radius: 4px;
    font-size: 0.8rem;
  }
  .error {
    color: red;
  }
</style>
