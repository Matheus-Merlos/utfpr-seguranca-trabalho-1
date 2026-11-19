<script lang="ts">
  import { getUsuarios, atualizarUsuario, deletarUsuario } from '$lib/api/usuarios';
  import { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Input, Label, Badge, Avatar, Skeleton, EmptyState, ErrorState, Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '$lib/components/ui';
  import { Users, Pencil, Trash2, AlertCircle } from 'lucide-svelte';

  let usuarios = $state<any[]>([]);
  let loading = $state(true);
  let error = $state('');
  let editDialog = $state(false);
  let deleteDialog = $state(false);
  let selectedUsuario = $state<any>(null);
  let editForm = $state({ nomeExibicao: '', email: '', role: '' });
  let saving = $state(false);

  $effect(() => {
    carregarUsuarios();
  });

  async function carregarUsuarios() {
    loading = true;
    error = '';
    try {
      usuarios = await getUsuarios();
    } catch (e) {
      error = 'Erro ao carregar usuários';
    }
    loading = false;
  }

  function abrirEdicao(usuario: any) {
    selectedUsuario = usuario;
    editForm = {
      nomeExibicao: usuario.nomeExibicao,
      email: usuario.email,
      role: usuario.role,
    };
    editDialog = true;
  }

  function abrirExclusao(usuario: any) {
    selectedUsuario = usuario;
    deleteDialog = true;
  }

  async function salvarEdicao() {
    if (!selectedUsuario) return;
    saving = true;
    try {
      await atualizarUsuario(selectedUsuario.id, editForm);
      await carregarUsuarios();
      editDialog = false;
    } catch (e) {
      error = 'Erro ao salvar usuário';
    }
    saving = false;
  }

  async function confirmarExclusao() {
    if (!selectedUsuario) return;
    saving = true;
    try {
      await deletarUsuario(selectedUsuario.id);
      await carregarUsuarios();
      deleteDialog = false;
    } catch (e) {
      error = 'Erro ao excluir usuário';
    }
    saving = false;
  }

  function getRoleVariant(role: string): 'default' | 'secondary' | 'success' {
    switch (role) {
      case 'ADMIN': return 'default';
      case 'PROFESSOR': return 'success';
      default: return 'secondary';
    }
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold">Gerenciar Usuários</h1>
      <p class="text-muted-foreground">Visualize e gerencie os usuários do sistema</p>
    </div>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Lista de Usuários</CardTitle>
    </CardHeader>
    <CardContent>
      {#if loading}
        <div class="space-y-3">
          {#each [1, 2, 3, 4, 5] as _}
            <div class="flex items-center gap-4">
              <Skeleton class="h-10 w-10 rounded-full" />
              <Skeleton class="h-10 flex-1" />
              <Skeleton class="h-10 w-24" />
              <Skeleton class="h-10 w-32" />
            </div>
          {/each}
        </div>
      {:else if error}
        <ErrorState
          title="Erro ao carregar"
          description={error}
          onRetry={carregarUsuarios}
        />
      {:else if usuarios.length === 0}
        <EmptyState
          icon={Users}
          title="Nenhum usuário"
          description="Não há usuários cadastrados no sistema."
        />
      {:else}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead class="text-center">Perfil</TableHead>
              <TableHead class="text-center w-32">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {#each usuarios as usuario}
              <TableRow>
                <TableCell>
                  <div class="flex items-center gap-3">
                    <Avatar fallback={usuario.nomeExibicao} size="sm" />
                    <span class="font-medium">{usuario.nomeExibicao}</span>
                  </div>
                </TableCell>
                <TableCell class="text-muted-foreground">@{usuario.username}</TableCell>
                <TableCell class="text-muted-foreground">{usuario.email}</TableCell>
                <TableCell class="text-center">
                  <Badge variant={getRoleVariant(usuario.role)}>{usuario.role}</Badge>
                </TableCell>
                <TableCell>
                  <div class="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" onclick={() => abrirEdicao(usuario)}>
                      <Pencil class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onclick={() => abrirExclusao(usuario)}>
                      <Trash2 class="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            {/each}
          </TableBody>
        </Table>
      {/if}
    </CardContent>
  </Card>
</div>

<!-- Edit Dialog -->
<Dialog bind:open={editDialog}>
  <DialogHeader>
    <DialogTitle>Editar Usuário</DialogTitle>
    <DialogDescription>Atualize as informações do usuário</DialogDescription>
  </DialogHeader>
  <div class="space-y-4 py-4">
    <div class="space-y-2">
      <Label for="edit-nome">Nome de Exibição</Label>
      <Input
        id="edit-nome"
        bind:value={editForm.nomeExibicao}
        disabled={saving}
      />
    </div>
    <div class="space-y-2">
      <Label for="edit-email">Email</Label>
      <Input
        id="edit-email"
        type="email"
        bind:value={editForm.email}
        disabled={saving}
      />
    </div>
    <div class="space-y-2">
      <Label for="edit-role">Perfil</Label>
      <select
        id="edit-role"
        bind:value={editForm.role}
        disabled={saving}
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="ALUNO">Aluno</option>
        <option value="PROFESSOR">Professor</option>
        <option value="ADMIN">Admin</option>
      </select>
    </div>
  </div>
  <DialogFooter>
    <Button variant="outline" onclick={() => editDialog = false} disabled={saving}>
      Cancelar
    </Button>
    <Button onclick={salvarEdicao} disabled={saving}>
      {saving ? 'Salvando...' : 'Salvar'}
    </Button>
  </DialogFooter>
</Dialog>

<!-- Delete Dialog -->
<Dialog bind:open={deleteDialog}>
  <DialogHeader>
    <DialogTitle>Confirmar Exclusão</DialogTitle>
    <DialogDescription>
      {#if selectedUsuario}
        <div class="flex items-center gap-2 mt-2 text-destructive">
          <AlertCircle class="h-4 w-4" />
          <span>Esta ação não pode ser desfeita.</span>
        </div>
        <p class="mt-2">
          Deseja realmente excluir o usuário <strong>{selectedUsuario.nomeExibicao}</strong>?
        </p>
      {/if}
    </DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <Button variant="outline" onclick={() => deleteDialog = false} disabled={saving}>
      Cancelar
    </Button>
    <Button variant="destructive" onclick={confirmarExclusao} disabled={saving}>
      {saving ? 'Excluindo...' : 'Excluir'}
    </Button>
  </DialogFooter>
</Dialog>
