<script lang="ts">
  let status = $state('Carregando...');

  async function checkApi() {
    try {
      const res = await fetch('/api');
      const data = await res.json();
      status = `API: ${data.name} - ${data.status}`;
    } catch {
      status = 'API indisponível';
    }
  }

  $effect(() => {
    checkApi();
  });
</script>

<main>
  <h1>SIGAcad</h1>
  <p>Sistema de Gestão Acadêmica</p>
  <p class="status">{status}</p>
</main>

<style>
  main {
    font-family: system-ui, sans-serif;
    text-align: center;
    padding: 2rem;
  }
  h1 {
    color: #1a365d;
  }
  .status {
    color: #666;
    font-size: 0.9rem;
  }
</style>
