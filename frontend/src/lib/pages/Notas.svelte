<script lang="ts">
  import { getDisciplinasProfessor, getAlunosDisciplina, atualizarNota } from '$lib/api/notas';
  import { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Input, Badge, Skeleton, EmptyState, ErrorState, Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '$lib/components/ui';
  import { BookOpen, Save, Check } from 'lucide-svelte';

  let disciplinas = $state<any[]>([]);
  let selectedDisciplina = $state<any>(null);
  let alunos = $state<any[]>([]);
  let loading = $state(true);
  let loadingAlunos = $state(false);
  let error = $state('');
  let saving = $state<string | null>(null);
  let confirmDialog = $state(false);
  let pendingNota = $state<{ id: string; aluno: string; nota1?: number; nota2?: number } | null>(null);

  $effect(() => {
    carregarDisciplinas();
  });

  async function carregarDisciplinas() {
    loading = true;
    error = '';
    try {
      disciplinas = await getDisciplinasProfessor();
    } catch (e) {
      error = 'Erro ao carregar disciplinas';
    }
    loading = false;
  }

  async function selecionarDisciplina(disc: any) {
    selectedDisciplina = disc;
    loadingAlunos = true;
    try {
      alunos = await getAlunosDisciplina(disc.id);
    } catch (e) {
      alunos = [];
    }
    loadingAlunos = false;
  }

  function abrirConfirmacao(aluno: any) {
    pendingNota = {
      id: aluno.matriculaId,
      aluno: aluno.nomeExibicao,
      nota1: aluno.nota1,
      nota2: aluno.nota2,
    };
    confirmDialog = true;
  }

  async function confirmarNota() {
    if (!pendingNota) return;
    saving = pendingNota.id;
    try {
      await atualizarNota(pendingNota.id, {
        nota1: pendingNota.nota1,
        nota2: pendingNota.nota2,
      });
      await selecionarDisciplina(selectedDisciplina);
    } catch (e) {
      error = 'Erro ao salvar nota';
    }
    saving = null;
    confirmDialog = false;
    pendingNota = null;
  }
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold">Lançamento de Notas</h1>
    <p class="text-muted-foreground">Selecione uma disciplina para lançar notas</p>
  </div>

  {#if loading}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each [1, 2, 3] as _}
        <Card>
          <CardContent class="p-4">
            <Skeleton class="h-5 w-20 mb-2" />
            <Skeleton class="h-6 w-full" />
          </CardContent>
        </Card>
      {/each}
    </div>
  {:else if error && !selectedDisciplina}
    <ErrorState
      title="Erro ao carregar"
      description={error}
      onRetry={carregarDisciplinas}
    />
  {:else if disciplinas.length === 0}
    <EmptyState
      icon={BookOpen}
      title="Nenhuma disciplina"
      description="Você não possui disciplinas atribuídas."
    />
  {:else}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each disciplinas as disc}
        <Card
          class="cursor-pointer transition-all hover:shadow-md hover:border-primary/20 {selectedDisciplina?.id === disc.id ? 'border-primary ring-2 ring-primary/20' : ''}"
        >
          <CardContent class="p-4" onclick={() => selecionarDisciplina(disc)}>
            <Badge variant="secondary" class="mb-2">{disc.codigo}</Badge>
            <h3 class="font-semibold">{disc.nome}</h3>
          </CardContent>
        </Card>
      {/each}
    </div>
  {/if}

  {#if selectedDisciplina}
    <Card>
      <CardHeader>
        <CardTitle>Alunos de {selectedDisciplina.nome}</CardTitle>
      </CardHeader>
      <CardContent>
        {#if loadingAlunos}
          <div class="space-y-3">
            {#each [1, 2, 3, 4] as _}
              <div class="flex gap-4">
                <Skeleton class="h-10 flex-1" />
                <Skeleton class="h-10 w-20" />
                <Skeleton class="h-10 w-20" />
                <Skeleton class="h-10 w-24" />
              </div>
            {/each}
          </div>
        {:else if alunos.length === 0}
          <EmptyState
            icon={BookOpen}
            title="Nenhum aluno matriculado"
            description="Esta disciplina não possui alunos matriculados."
          />
        {:else}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead class="text-center w-24">Nota 1</TableHead>
                <TableHead class="text-center w-24">Nota 2</TableHead>
                <TableHead class="text-center w-24">Final</TableHead>
                <TableHead class="text-center w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {#each alunos as aluno}
                <TableRow>
                  <TableCell class="font-medium">{aluno.nomeExibicao}</TableCell>
                  <TableCell class="text-center">
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={aluno.nota1 ?? ''}
                      class="w-20 text-center"
                      onchange={(e: Event) => aluno.nota1 = parseFloat((e.target as HTMLInputElement).value) || undefined}
                    />
                  </TableCell>
                  <TableCell class="text-center">
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={aluno.nota2 ?? ''}
                      class="w-20 text-center"
                      onchange={(e: Event) => aluno.nota2 = parseFloat((e.target as HTMLInputElement).value) || undefined}
                    />
                  </TableCell>
                  <TableCell class="text-center font-semibold">
                    {aluno.notaFinal ?? '-'}
                  </TableCell>
                  <TableCell class="text-center">
                    <Button
                      size="sm"
                      onclick={() => abrirConfirmacao(aluno)}
                      disabled={saving === aluno.matriculaId}
                    >
                      {#if saving === aluno.matriculaId}
                        Salvando...
                      {:else}
                        <Save class="h-4 w-4 mr-1" />
                        Salvar
                      {/if}
                    </Button>
                  </TableCell>
                </TableRow>
              {/each}
            </TableBody>
          </Table>
        {/if}
      </CardContent>
    </Card>
  {/if}
</div>

<Dialog bind:open={confirmDialog}>
  <DialogHeader>
    <DialogTitle>Confirmar Lançamento</DialogTitle>
    <DialogDescription>
      {#if pendingNota}
        Deseja salvar as notas de <strong>{pendingNota.aluno}</strong>?
        <div class="mt-2 text-sm">
          <span>Nota 1: {pendingNota.nota1 ?? '-'}</span>
          <span class="mx-2">|</span>
          <span>Nota 2: {pendingNota.nota2 ?? '-'}</span>
        </div>
      {/if}
    </DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <Button variant="outline" onclick={() => confirmDialog = false}>
      Cancelar
    </Button>
    <Button onclick={confirmarNota}>
      <Check class="h-4 w-4 mr-1" />
      Confirmar
    </Button>
  </DialogFooter>
</Dialog>
