# Tasks

## Setup

- [x] Instalar dependências: tailwindcss@4, @tailwindcss/vite, bits-ui, clsx, tailwind-merge, tailwind-variants, lucide-svelte, svelte-sonner
- [x] Configurar Tailwind v4 no vite.config.ts
- [x] Criar `src/app.css` com tema (cores, tipografia, variáveis CSS)
- [x] Importar fonte Inter do Google Fonts no index.html
- [x] Criar utilitário `cn()` em `src/lib/utils.ts`

## Componentes base (src/lib/components/ui)

- [x] Criar button.svelte com variantes (default, secondary, destructive, outline, ghost)
- [x] Criar card.svelte (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- [x] Criar input.svelte com estados (default, error, disabled)
- [x] Criar label.svelte
- [x] Criar badge.svelte com variantes (default, success, warning, destructive)
- [x] Criar avatar.svelte com fallback de iniciais
- [x] Criar skeleton.svelte
- [x] Criar table.svelte (Table, TableHeader, TableBody, TableRow, TableHead, TableCell)
- [x] Criar dialog.svelte (Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter)
- [ ] Criar dropdown-menu.svelte

## Layout

- [x] Criar sidebar.svelte com navegação por perfil e estado colapsado
- [x] Criar topbar.svelte com logo, breadcrumb, avatar e logout
- [ ] Criar breadcrumb.svelte
- [x] Criar mobile-menu.svelte (hamburger + drawer)
- [x] Criar layout-shell.svelte que combina sidebar + topbar + slot de conteúdo
- [x] Criar empty-state.svelte com ícone, título e descrição
- [x] Criar error-state.svelte com botão de retry

## Páginas públicas

- [x] Refatorar Login.svelte: card centralizado, logo SIGAcad, fundo gradiente, inputs estilizados
- [x] Refatorar RecuperarSenha.svelte com mesmo estilo do login
- [x] Refatorar ResetarSenha.svelte com mesmo estilo do login

## Páginas autenticadas

- [x] Refatorar App.svelte para usar layout-shell nas rotas autenticadas
- [x] Refatorar Dashboard.svelte: cards de resumo (média, faltas, disciplinas) com stats
- [x] Refatorar Boletim.svelte: tabela com badges de situação (Aprovado/Recuperação/Reprovado), skeleton loading
- [x] Refatorar Busca.svelte: input com ícone de lupa, grid de cards, empty state; MANTER {@html termo}
- [x] Refatorar Mural.svelte: cards de recados com avatar e data, form de novo recado; MANTER {@html} no conteúdo e autor
- [x] Refatorar Perfil.svelte: card com form de edição, toast de feedback

## Páginas de professor

- [x] Criar página de lançamento de notas com tabela editável e dialog de confirmação

## Páginas de admin

- [x] Criar página de listagem de usuários com tabela, badges de role, dialog de edição

## Estados e feedback

- [x] Adicionar skeleton loading em todas as páginas que fazem fetch
- [x] Adicionar empty state quando listas estão vazias
- [x] Adicionar error state com retry em caso de falha de API
- [ ] Configurar svelte-sonner e adicionar toasts de sucesso/erro nas ações

## Responsividade

- [ ] Testar e ajustar layout em mobile (< 768px)
- [ ] Testar e ajustar layout em tablet (768px - 1024px)
- [x] Garantir que sidebar colapsa em menu hamburger no mobile

## Verificação de vulnerabilidades

- [ ] Testar VULN-03: criar recado com `<img src=x onerror="alert('XSS-03')">` e verificar execução
- [ ] Testar VULN-03: alterar nomeExibicao para `<img src=x onerror="alert('XSS-03-nome')">` e verificar no mural
- [ ] Testar VULN-04: acessar `/busca?q=<img src=x onerror="alert('XSS-04')">` e verificar execução
- [x] Verificar que nenhum sanitizador foi adicionado (grep por DOMPurify, sanitize)
- [x] Verificar que não há CSP (grep por Content-Security-Policy)

## Finalização

- [x] Rodar build de produção e verificar que funciona como SPA
- [ ] Testar todas as rotas após build
- [ ] Remover estilos inline antigos não utilizados
