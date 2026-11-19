<script lang="ts">
  import { auth } from '$lib/stores/auth';

  let user = $derived($auth.user);
</script>

<div class="dashboard">
  <h2>Dashboard</h2>

  {#if user}
    <p class="welcome">Bem-vindo, <strong>{user.nomeExibicao}</strong>!</p>
    <p class="role">Perfil: {user.role}</p>

    <div class="cards">
      {#if user.role === 'ALUNO'}
        <a href="#/boletim" class="card">
          <h3>📋 Boletim</h3>
          <p>Visualize suas notas</p>
        </a>
      {/if}

      <a href="#/busca" class="card">
        <h3>🔍 Disciplinas</h3>
        <p>Buscar disciplinas</p>
      </a>

      <a href="#/mural" class="card">
        <h3>📢 Mural</h3>
        <p>Recados e avisos</p>
      </a>

      <a href="#/perfil" class="card">
        <h3>👤 Perfil</h3>
        <p>Editar dados</p>
      </a>

      {#if user.role === 'ADMIN'}
        <div class="card admin">
          <h3>⚙️ Admin</h3>
          <p>Área administrativa</p>
        </div>
      {/if}
    </div>
  {:else}
    <p>Carregando...</p>
  {/if}
</div>

<style>
  .dashboard {
    max-width: 800px;
    margin: 0 auto;
  }
  .welcome {
    font-size: 1.25rem;
  }
  .role {
    color: #666;
    margin-bottom: 2rem;
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  .card {
    display: block;
    padding: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.2s;
  }
  .card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .card h3 {
    margin: 0 0 0.5rem;
    color: #1a365d;
  }
  .card p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
  .card.admin {
    background: #f0f4f8;
    cursor: not-allowed;
    opacity: 0.7;
  }
</style>
