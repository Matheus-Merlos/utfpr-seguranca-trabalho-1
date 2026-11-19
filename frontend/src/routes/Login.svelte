<script lang="ts">
  import { login } from '$lib/stores/auth';
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Label, Button } from '$lib/components/ui';
  import { AlertCircle } from 'lucide-svelte';

  let username = $state('');
  let senha = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    loading = true;

    try {
      await login(username, senha);
      window.location.hash = '/dashboard';
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
  <div class="w-full max-w-md">
    <!-- Logo -->
    <div class="flex flex-col items-center mb-8">
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg mb-4">
        S
      </div>
      <h1 class="text-2xl font-bold text-foreground">SIGAcad</h1>
      <p class="text-sm text-muted-foreground">Sistema de Gestão Acadêmica</p>
    </div>

    <Card>
      <CardHeader class="text-center">
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse sua conta para continuar</CardDescription>
      </CardHeader>

      <form onsubmit={handleSubmit}>
        <CardContent class="space-y-4">
          {#if error}
            <div class="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle class="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          {/if}

          <div class="space-y-2">
            <Label for="username">Usuário</Label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu usuário"
              bind:value={username}
              disabled={loading}
            />
          </div>

          <div class="space-y-2">
            <Label for="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              bind:value={senha}
              disabled={loading}
            />
          </div>
        </CardContent>

        <CardFooter class="flex-col gap-4">
          <Button type="submit" class="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <a href="#/recuperar-senha" class="text-sm text-muted-foreground hover:text-primary transition-colors">
            Esqueci minha senha
          </a>
        </CardFooter>
      </form>
    </Card>
  </div>
</div>
