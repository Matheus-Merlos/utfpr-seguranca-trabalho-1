<script lang="ts">
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Label, Button } from '$lib/components/ui';
  import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-svelte';

  let token = $state('');
  let novaSenha = $state('');
  let confirmarSenha = $state('');
  let message = $state('');
  let error = $state('');
  let loading = $state(false);

  $effect(() => {
    const params = new URLSearchParams(window.location.search);
    token = params.get('token') || '';
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    message = '';

    if (novaSenha !== confirmarSenha) {
      error = 'As senhas não coincidem';
      return;
    }

    loading = true;

    try {
      const res = await fetch('/api/auth/resetar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      message = data.message;
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
    </div>

    <Card>
      <CardHeader class="text-center">
        <CardTitle>Resetar Senha</CardTitle>
        <CardDescription>Digite sua nova senha</CardDescription>
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
            <Label for="token">Token</Label>
            <Input
              id="token"
              type="text"
              placeholder="Cole o token recebido"
              bind:value={token}
              disabled={loading}
            />
          </div>

          <div class="space-y-2">
            <Label for="novaSenha">Nova Senha</Label>
            <Input
              id="novaSenha"
              type="password"
              placeholder="Digite a nova senha"
              bind:value={novaSenha}
              disabled={loading}
            />
          </div>

          <div class="space-y-2">
            <Label for="confirmarSenha">Confirmar Senha</Label>
            <Input
              id="confirmarSenha"
              type="password"
              placeholder="Confirme a nova senha"
              bind:value={confirmarSenha}
              disabled={loading}
            />
          </div>
        </CardContent>

        <CardFooter class="flex-col gap-4">
          <Button type="submit" class="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>

          <a href="#/login" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft class="h-4 w-4" />
            Voltar ao login
          </a>
        </CardFooter>
      </form>
    </Card>
  </div>
</div>
