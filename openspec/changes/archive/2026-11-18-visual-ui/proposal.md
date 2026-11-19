## Why

O frontend atual usa estilos inline básicos. Este change implementa um design system profissional com Tailwind CSS v4, shadcn-svelte e componentes reutilizáveis, mantendo a identidade visual própria do SIGAcad.

## What Changes

- Instalar Tailwind CSS v4, shadcn-svelte, @lucide/svelte, svelte-sonner
- Configurar tema com cores do SIGAcad (azul-marinho, âmbar, neutros)
- Criar componentes base em `src/lib/components/ui`
- Refatorar todas as páginas para usar o novo design system
- Implementar layout autenticado com sidebar e topbar
- Adicionar estados de loading, vazio e erro em todas as telas
- Tornar o layout responsivo (mobile-first)

## Vulnerabilidades implementadas

Nenhuma nova — este change preserva as existentes:
- **VULN-03** XSS armazenado no mural: `{@html}` mantido sem sanitização
- **VULN-04** XSS DOM na busca: `{@html}` mantido sem sanitização

## Fora de escopo

- Alteração de rotas ou lógica de navegação
- Alteração de chamadas à API ou payloads
- Alteração da lógica de autenticação
- Adição de sanitização (DOMPurify ou similar)
- Adição de Content-Security-Policy
- Novas funcionalidades ou páginas

## Capabilities

### New Capabilities

- `design-system`: Tema, tokens e componentes base shadcn-svelte
- `layout-shell`: Sidebar, topbar e breadcrumb para área autenticada
- `ui-states`: Componentes de skeleton, empty state e error state

### Modified Capabilities

- `login`: Card centralizado com logo e gradiente
- `dashboard`: Cards de resumo por perfil
- `boletim`: Tabela com badges de situação
- `disciplinas`: Grid de cards com busca
- `mural`: Cards de recados com avatar
- `perfil`: Formulário estilizado

## Impact

- Adiciona dependências: tailwindcss, shadcn-svelte, @lucide/svelte, svelte-sonner
- Modifica todos os arquivos .svelte do frontend
- Adiciona arquivos de configuração (tailwind, theme)
- Adiciona componentes em src/lib/components/ui
- Build continua sendo SPA estática para S3
