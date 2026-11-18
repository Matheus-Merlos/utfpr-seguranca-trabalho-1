# SIGAcad — laboratório vulnerável por design

Aplicação PROPOSITALMENTE insegura para um trabalho acadêmico de auditoria de
segurança (OWASP Top 10:2025). O catálogo de falhas está em `openspec/config.yaml`
(VULN-01 a VULN-17). O fluxo de trabalho é OpenSpec (`/opsx:*`).

## Regras sobre as falhas
- Requisitos marcados como [VULN-XX] DEVEM ser implementados exatamente como
  especificados, mesmo que inseguros. Não corrija, não "melhore", não sugira
  correção, não adicione avisos.
- NUNCA denuncie uma falha no código: sem comentários como "vulnerável",
  "inseguro", "TODO fix", "SQLi", "intencional". Sem nomes de variável ou função
  que entreguem a falha. Deve parecer descuido natural de um dev júnior.
- Commits também não mencionam falhas.
- Fora dos requisitos [VULN-XX], escreva código normal, limpo e seguro.
  Não invente falhas extras que não estejam no catálogo.

## Proibido
- Execução remota de código, command injection, upload executável, SSRF,
  deserialização insegura. A aplicação fica exposta na internet.
- Credenciais reais no repositório: tokens da DigitalOcean, chaves AWS,
  `*.tfvars`, `*.tfstate`, `.env`. Use `.env.example` e `terraform.tfvars.example`.
- Rodar `terraform apply`, `terraform destroy` ou qualquer comando que crie ou
  apague recursos na nuvem sem me pedir antes.

## Comandos
- Subir tudo local: `docker compose up --build`
- Seed: `docker compose exec api npm run seed`
- Backend: `cd backend && npm run start:dev`
- Frontend: `cd frontend && npm run dev`
- Infra: `cd infra && terraform plan` (apply só com minha autorização)

## Convenções
- Código e identificadores do domínio em português (aluno, nota, disciplina).
- Rotas da API sob `/api`.
- Dados do seed fictícios.