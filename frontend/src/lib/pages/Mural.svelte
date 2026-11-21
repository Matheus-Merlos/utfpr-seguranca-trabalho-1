<script lang="ts">
  import { getRecados, criarRecado } from '$lib/api/mural';
  import { Card, CardContent, Button, Avatar, Badge, Skeleton, EmptyState, ErrorState } from '$lib/components/ui';
  import { MessageSquare, Send } from 'lucide-svelte';

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

<div class="space-y-6 max-w-2xl">
  <div>
    <h1 class="text-2xl font-bold">Mural de Recados</h1>
    <p class="text-muted-foreground">Compartilhe avisos e informações</p>
  </div>

  <!-- New Message Form -->
  <Card>
    <CardContent class="p-4">
      <form onsubmit={enviarRecado} class="space-y-3">
        <textarea
          bind:value={novoRecado}
          placeholder="Escreva um recado..."
          rows="3"
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        ></textarea>
        <div class="flex justify-end">
          <Button type="submit" disabled={enviando}>
            {#if enviando}
              Enviando...
            {:else}
              <Send class="h-4 w-4 mr-2" />
              Publicar
            {/if}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>

  <!-- Messages List -->
  {#if loading}
    <div class="space-y-4">
      {#each [1, 2, 3] as _}
        <Card>
          <CardContent class="p-4">
            <div class="flex gap-3">
              <Skeleton class="h-10 w-10 rounded-full" />
              <div class="flex-1 space-y-2">
                <div class="flex items-center justify-between">
                  <Skeleton class="h-4 w-32" />
                  <Skeleton class="h-3 w-24" />
                </div>
                <Skeleton class="h-16 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if error}
    <ErrorState
      title="Erro ao carregar"
      description={error}
      onRetry={carregarRecados}
    />
  {:else if recados.length === 0}
    <EmptyState
      icon={MessageSquare}
      title="Nenhum recado"
      description="Seja o primeiro a publicar um recado!"
    />
  {:else}
    <div class="space-y-4">
      {#each recados as recado}
        <Card>
          <CardContent class="p-4">
            <div class="flex gap-3">
              <Avatar fallback={recado.autor.nomeExibicao} size="md" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="font-semibold text-primary truncate">{recado.autor.nomeExibicao}</span>
                  <span class="text-xs text-muted-foreground whitespace-nowrap">
                    {formatarData(recado.dataHora)}
                  </span>
                </div>
                <div class="text-sm leading-relaxed">{recado.conteudo}</div>
                {#if recado.disciplina}
                  <Badge variant="secondary" class="mt-3">
                    {recado.disciplina.nome}
                  </Badge>
                {/if}
              </div>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {/if}
</div>
