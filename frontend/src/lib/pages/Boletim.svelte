<script lang="ts">
  import { auth } from '$lib/stores/auth';
  import { getBoletim } from '$lib/api/boletim';
  import { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Skeleton, EmptyState, ErrorState } from '$lib/components/ui';
  import { BookOpen } from 'lucide-svelte';

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

  function getStatusVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' {
    switch (status) {
      case 'APROVADO': return 'success';
      case 'RECUPERAÇÃO': return 'warning';
      case 'REPROVADO': return 'destructive';
      default: return 'secondary';
    }
  }
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold">Meu Boletim</h1>
    <p class="text-muted-foreground">Visualize suas notas e situação nas disciplinas</p>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Notas do Semestre</CardTitle>
    </CardHeader>
    <CardContent>
      {#if loading}
        <div class="space-y-3">
          {#each [1, 2, 3, 4] as _}
            <div class="flex gap-4">
              <Skeleton class="h-10 w-20" />
              <Skeleton class="h-10 flex-1" />
              <Skeleton class="h-10 w-16" />
              <Skeleton class="h-10 w-16" />
              <Skeleton class="h-10 w-16" />
              <Skeleton class="h-10 w-24" />
            </div>
          {/each}
        </div>
      {:else if error}
        <ErrorState
          title="Erro ao carregar"
          description={error}
          onRetry={carregarBoletim}
        />
      {:else if notas.length === 0}
        <EmptyState
          icon={BookOpen}
          title="Sem matrículas"
          description="Você não está matriculado em nenhuma disciplina."
        />
      {:else}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead class="text-center">Nota 1</TableHead>
              <TableHead class="text-center">Nota 2</TableHead>
              <TableHead class="text-center">Final</TableHead>
              <TableHead class="text-center">Situação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {#each notas as nota}
              <TableRow>
                <TableCell class="font-mono text-sm">{nota.disciplina.codigo}</TableCell>
                <TableCell class="font-medium">{nota.disciplina.nome}</TableCell>
                <TableCell class="text-center">{nota.nota1 ?? '-'}</TableCell>
                <TableCell class="text-center">{nota.nota2 ?? '-'}</TableCell>
                <TableCell class="text-center font-semibold">{nota.notaFinal ?? '-'}</TableCell>
                <TableCell class="text-center">
                  <Badge variant={getStatusVariant(nota.status)}>
                    {nota.status}
                  </Badge>
                </TableCell>
              </TableRow>
            {/each}
          </TableBody>
        </Table>
      {/if}
    </CardContent>
  </Card>
</div>
