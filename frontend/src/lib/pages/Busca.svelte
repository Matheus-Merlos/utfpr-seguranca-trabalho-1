<script lang="ts">
  import { buscarDisciplinas } from '$lib/api/disciplinas';
  import { Card, CardContent, Input, Button, Skeleton, EmptyState, ErrorState } from '$lib/components/ui';
  import { Search, BookOpen, User } from 'lucide-svelte';

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
    }
    executarBusca();
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

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold">Disciplinas</h1>
    <p class="text-muted-foreground">Busque por nome ou código da disciplina</p>
  </div>

  <!-- Search Form -->
  <form onsubmit={handleSubmit} class="flex gap-2">
    <div class="relative flex-1">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        bind:value={termo}
        placeholder="Nome ou código da disciplina..."
        class="pl-10"
      />
    </div>
    <Button type="submit">Buscar</Button>
  </form>

  <!-- Results Header -->
  {#if buscado}
    <h2 class="text-lg font-semibold">Resultados para: {buscado}</h2>
  {:else if resultados.length > 0}
    <h2 class="text-lg font-semibold">Todas as disciplinas</h2>
  {/if}

  <!-- Results -->
  {#if loading}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each [1, 2, 3, 4, 5, 6] as _}
        <Card>
          <CardContent class="p-4">
            <Skeleton class="h-5 w-20 mb-2" />
            <Skeleton class="h-6 w-full mb-3" />
            <Skeleton class="h-4 w-32" />
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if error}
    <ErrorState
      title="Erro ao buscar"
      description={error}
      onRetry={executarBusca}
    />
  {:else if resultados.length > 0}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each resultados as disc}
        <Card class="transition-all hover:shadow-md hover:border-primary/20">
          <CardContent class="p-4">
            <div class="flex items-start justify-between mb-2">
              <span class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {disc.codigo}
              </span>
            </div>
            <h3 class="font-semibold mb-2">{disc.nome}</h3>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <User class="h-4 w-4" />
              <span>{disc.professor?.nomeExibicao || disc.professorNome || 'Não atribuído'}</span>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if buscado}
    <EmptyState
      icon={BookOpen}
      title="Nenhuma disciplina encontrada"
      description="Tente ajustar o termo de busca"
    />
  {/if}
</div>
