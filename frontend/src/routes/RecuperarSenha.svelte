<script lang="ts">
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Label, Button } from '$lib/components/ui';
  import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-svelte';

  let email = $state('');
  let message = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    message = '';
    loading = true;

    try {
      const res = await fetch('/api/auth/recuperar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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
        <CardTitle>Recuperar Senha</CardTitle>
        <CardDescription>Digite seu email para receber as instruções</CardDescription>
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

        <CardFooter class="flex-col gap-4">
          <Button type="submit" class="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
          <a href="#/resetar-senha" class="text-sm text-primary hover:underline">Já tenho um código</a>

          <a href="#/login" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft class="h-4 w-4" />
            Voltar ao login
          </a>
        </CardFooter>
      </form>
    </Card>
  </div>
</div>
