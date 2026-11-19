<script lang="ts">
  import { auth, checkAuth } from '$lib/stores/auth';
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Label, Button, Badge, Avatar } from '$lib/components/ui';
  import { AlertCircle, CheckCircle, User } from 'lucide-svelte';

  let nomeExibicao = $state('');
  let email = $state('');
  let message = $state('');
  let error = $state('');
  let loading = $state(false);

  let user = $derived($auth.user);

  $effect(() => {
    if (user) {
      nomeExibicao = user.nomeExibicao;
      email = user.email;
    }
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    message = '';
    loading = true;

    try {
      const res = await fetch('/api/usuarios/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nomeExibicao, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      message = 'Perfil atualizado com sucesso';
      await checkAuth();
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="space-y-6 max-w-xl">
  <div>
    <h1 class="text-2xl font-bold">Meu Perfil</h1>
    <p class="text-muted-foreground">Gerencie suas informações pessoais</p>
  </div>

  {#if user}
    <!-- Profile Header -->
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center gap-4">
          <Avatar fallback={user.nomeExibicao} size="lg" />
          <div>
            <h2 class="text-lg font-semibold">{user.nomeExibicao}</h2>
            <div class="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{user.role}</Badge>
              <span class="text-sm text-muted-foreground">@{user.username}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Edit Form -->
    <Card>
      <CardHeader>
        <CardTitle>Editar Informações</CardTitle>
        <CardDescription>Atualize seu nome de exibição e email</CardDescription>
      </CardHeader>

      <form onsubmit={handleSubmit}>
        <CardContent class="space-y-4">
          {#if error}
            <div class="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle class="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          {/if}

          {#if message}
            <div class="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm text-success">
              <CheckCircle class="h-4 w-4 shrink-0" />
              <span>{message}</span>
            </div>
          {/if}

          <div class="space-y-2">
            <Label for="nomeExibicao">Nome de Exibição</Label>
            <Input
              id="nomeExibicao"
              type="text"
              placeholder="Como você quer ser chamado"
              bind:value={nomeExibicao}
              disabled={loading}
            />
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@exemplo.com"
              bind:value={email}
              disabled={loading}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  {:else}
    <Card>
      <CardContent class="p-6">
        <p class="text-muted-foreground">Carregando...</p>
      </CardContent>
    </Card>
  {/if}
</div>
