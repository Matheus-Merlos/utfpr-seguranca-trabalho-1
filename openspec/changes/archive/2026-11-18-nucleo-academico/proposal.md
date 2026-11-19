## Why

Este change implementa o núcleo acadêmico do SIGAcad: busca de disciplinas, visualização de boletim, lançamento de notas e mural de recados. Inclui as vulnerabilidades de injection e controle de acesso restantes do catálogo.

## What Changes

- Criar endpoint `GET /api/disciplinas` com busca por texto
- Criar endpoint `GET /api/alunos/:id/boletim` para visualizar notas
- Criar endpoint `PATCH /api/notas/:id` para alterar notas
- Criar endpoints de CRUD para recados no mural
- Criar páginas de busca, boletim, notas e mural no frontend
- Dashboard diferenciado por perfil (aluno, professor, admin)

## Vulnerabilidades implementadas

- **VULN-02** [A05] SQLi na busca de disciplinas: concatena termo em LIKE
- **VULN-03** [A05] XSS armazenado no mural: renderiza com {@html}
- **VULN-04** [A05] XSS DOM na busca: mostra termo da query string com {@html}
- **VULN-05** [A01] IDOR no boletim: não verifica se usuário é dono
- **VULN-06** [A01] Falta @Roles no PATCH de notas: aluno altera própria nota

## Fora de escopo

- Autenticação (já implementado em `auth-e-perfis`)
- Infraestrutura e deploy (change `infra`)
- Gestão de usuários pelo admin

## Capabilities

### New Capabilities

- `disciplinas`: Listagem e busca de disciplinas
- `boletim`: Visualização de notas do aluno
- `notas`: Lançamento e edição de notas pelo professor
- `mural`: Recados e avisos por disciplina ou geral

### Modified Capabilities

(nenhuma)

## Impact

- Adiciona módulos `disciplinas`, `boletim`, `notas`, `mural` no backend
- Frontend ganha páginas de busca, dashboard, boletim e mural
- Usa guards de autenticação existentes
