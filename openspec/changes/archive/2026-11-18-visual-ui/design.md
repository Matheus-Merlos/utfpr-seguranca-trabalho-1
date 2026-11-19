## Context

O frontend precisa de um redesign visual profissional mantendo todas as funcionalidades e vulnerabilidades existentes. A stack escolhida (Tailwind v4 + shadcn-svelte) permite componentes consistentes e customizáveis.

## Goals / Non-Goals

**Goals:**
- Design system coeso com identidade SIGAcad
- Componentes reutilizáveis via shadcn-svelte
- Layout responsivo (desktop/mobile)
- Estados visuais completos (loading, empty, error)
- Manter VULN-03 e VULN-04 funcionando

**Non-Goals:**
- Alterar lógica de negócio
- Modificar API calls
- Adicionar sanitização de HTML
- Implementar SSR

## Decisions

### D1: Paleta de cores

```css
:root {
  --primary: #1e3a5f;      /* Azul-marinho SIGAcad */
  --primary-foreground: #ffffff;
  --secondary: #f1f5f9;    /* Slate-100 */
  --accent: #f59e0b;       /* Âmbar para alertas */
  --background: #f8fafc;   /* Fundo neutro claro */
  --foreground: #0f172a;   /* Texto principal */
  --muted: #64748b;        /* Texto secundário */
  --border: #e2e8f0;
  --success: #22c55e;      /* Verde aprovado */
  --warning: #f59e0b;      /* Âmbar recuperação */
  --destructive: #ef4444;  /* Vermelho reprovado */
}
```

### D2: Tipografia

Font Inter via Google Fonts. Escala compacta para densidade de painel:

```css
--font-sans: 'Inter', system-ui, sans-serif;
--text-xs: 0.75rem;   /* 12px - labels */
--text-sm: 0.875rem;  /* 14px - body */
--text-base: 1rem;    /* 16px - headings */
--text-lg: 1.125rem;  /* 18px - section titles */
--text-xl: 1.25rem;   /* 20px - page titles */
```

### D3: Estrutura de componentes shadcn-svelte

```
src/lib/components/ui/
├── button.svelte
├── card.svelte
├── input.svelte
├── label.svelte
├── badge.svelte
├── avatar.svelte
├── skeleton.svelte
├── table.svelte
├── dialog.svelte
├── dropdown-menu.svelte
├── sidebar.svelte
├── topbar.svelte
├── breadcrumb.svelte
├── empty-state.svelte
└── error-state.svelte
```

### D4: Layout autenticado

```
┌─────────────────────────────────────────────────────────┐
│ Topbar: Logo | Breadcrumb          | Avatar | Logout   │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │              Content Area                    │
│          │                                              │
│ - Home   │  ┌──────────────────────────────────────┐   │
│ - Item 1 │  │                                      │   │
│ - Item 2 │  │          Page Content                │   │
│ - Item 3 │  │                                      │   │
│          │  └──────────────────────────────────────┘   │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

Mobile: sidebar colapsa em menu hamburger.

### D5: Navegação por perfil

```typescript
const navItems = {
  ALUNO: [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: BookOpen, label: 'Boletim', href: '/boletim' },
    { icon: Search, label: 'Disciplinas', href: '/busca' },
    { icon: MessageSquare, label: 'Mural', href: '/mural' },
    { icon: User, label: 'Perfil', href: '/perfil' },
  ],
  PROFESSOR: [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: ClipboardList, label: 'Lançar Notas', href: '/notas' },
    { icon: Search, label: 'Disciplinas', href: '/busca' },
    { icon: MessageSquare, label: 'Mural', href: '/mural' },
    { icon: User, label: 'Perfil', href: '/perfil' },
  ],
  ADMIN: [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Usuários', href: '/admin/usuarios' },
    { icon: BookOpen, label: 'Disciplinas', href: '/busca' },
    { icon: MessageSquare, label: 'Mural', href: '/mural' },
    { icon: User, label: 'Perfil', href: '/perfil' },
  ],
};
```

### D6: Páginas e componentes

| Página | Componentes principais |
|--------|------------------------|
| Login | Card, Input, Button, gradiente de fundo |
| Dashboard | Card (resumo), Badge, stats grid |
| Boletim | Table, Badge (situação), skeleton rows |
| Busca | Input (search), Card grid, empty state |
| Mural | Card, Avatar, Badge (data), form |
| Perfil | Card, Input, Button, toast feedback |
| Notas (prof) | Table, Input, Button, Dialog |
| Usuários (admin) | Table, Badge, Dialog, pagination |

### D7: Estados visuais

**Loading:**
```svelte
<Skeleton class="h-4 w-full" />
<Skeleton class="h-32 w-full" />
```

**Empty:**
```svelte
<EmptyState 
  icon={Inbox}
  title="Nenhum resultado"
  description="Tente ajustar os filtros"
/>
```

**Error:**
```svelte
<ErrorState
  title="Erro ao carregar"
  description={error.message}
  onRetry={reload}
/>
```

### D8: Preservação das vulnerabilidades XSS

VULN-03 (mural) - manter exatamente:
```svelte
<span class="autor">{@html recado.autor.nomeExibicao}</span>
<p class="conteudo">{@html recado.conteudo}</p>
```

VULN-04 (busca) - manter exatamente:
```svelte
<h3>Resultados para: {@html termo}</h3>
```

### D9: Responsividade

Breakpoints Tailwind padrão:
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)

Sidebar: `hidden lg:flex` / Mobile menu: `flex lg:hidden`

### D10: Dependências

```json
{
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  },
  "dependencies": {
    "bits-ui": "^1.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "tailwind-variants": "^0.3.0",
    "@lucide/svelte": "^0.400.0",
    "svelte-sonner": "^0.3.0"
  }
}
```

## Risks / Trade-offs

| Risco | Mitigação |
|-------|-----------|
| Quebrar XSS existente | Tasks de verificação com payloads reais |
| Regressões visuais | Testar todas as páginas manualmente |
| Bundle size maior | Tree-shaking do Tailwind e Lucide |
| Complexidade de migração | Migrar uma página por vez |

## Open Questions

Nenhuma — as decisões estão consolidadas.
