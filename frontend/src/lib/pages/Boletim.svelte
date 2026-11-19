<script lang="ts">
  import { auth } from '$lib/stores/auth';
  import { getBoletim } from '$lib/api/boletim';

  let notas = $state<any[]>([]);
  let loading = $state(true);
  let error = $state('');

  let user = $derived($auth.user);

  $effect(() => {
    if (user) {
      carregarBoletim();
    }
  });

  async function carregarBoletim() {
    loading = true;
    error = '';
    try {
      notas = await getBoletim(user.id);
    } catch (e) {
      error = 'Erro ao carregar boletim';
    }
    loading = false;
  }
</script>

<div class="boletim">
  <h2>Meu Boletim</h2>

  {#if loading}
    <p>Carregando...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if notas.length === 0}
    <p>Você não está matriculado em nenhuma disciplina.</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Disciplina</th>
          <th>Nota 1</th>
          <th>Nota 2</th>
          <th>Final</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {#each notas as nota}
          <tr class={nota.status === 'REPROVADO' ? 'reprovado' : ''}>
            <td>{nota.disciplina.codigo}</td>
            <td>{nota.disciplina.nome}</td>
            <td>{nota.nota1 ?? '-'}</td>
            <td>{nota.nota2 ?? '-'}</td>
            <td>{nota.notaFinal ?? '-'}</td>
            <td class="status">{nota.status}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .boletim {
    max-width: 900px;
    margin: 0 auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 0.75rem;
    border: 1px solid #ddd;
    text-align: center;
  }
  th {
    background: #f5f5f5;
  }
  td:first-child, td:nth-child(2) {
    text-align: left;
  }
  .reprovado {
    background: #fee;
  }
  .status {
    font-weight: bold;
  }
  .error {
    color: red;
  }
</style>
