# ACH-06 — Configuração de segurança

## Informações Gerais

| Campo | Valor |
|-------|-------|
| **ID** | ACH-06 |
| **Título** | CORS reflexivo, banco com senha padrão publicada e superfície de diagnóstico aberta |
| **Categoria OWASP Top 10:2025** | A02 Security Misconfiguration |
| **CWE** | CWE-942 Permissive Cross-domain Policy; CWE-798 Use of Hard-coded Credentials; CWE-16 Configuration |
| **Teste WSTG** | WSTG-CONF-01 Test Network Infrastructure Configuration; WSTG-CLNT-07 Testing Cross Origin Resource Sharing; WSTG-ATHN-02 Testing for Default Credentials |
| **Severidade** | Alta no laboratório local; crítica se a porta do banco estiver acessível fora da máquina |
| **Vetor CVSS 3.1** | Banco: AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (9.8). CORS: AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N (5.4) |
| **Nota CVSS** | 9.8 no item de banco, condicionado à alcance da porta |
| **Ativo Afetado** | `docker-compose.yml`, `app.module.ts`, `main.ts` (`enableCors`, Swagger), `infra/cloud-init.yaml` |
| **Responsável** | Grupo (preencher) |
| **Data** | 2026-11-21 |
| **Status** | Aberto |

## Descrição

Itens de configuração, separados das falhas de código dos achados anteriores.

1. **PostgreSQL.** `docker-compose.yml` publica `5432:5432` e usa a senha padrão `sigacad` quando `DB_PASSWORD` não existe. O mesmo padrão está em `app.module.ts`, `.env.example` e `infra/cloud-init.yaml`. `synchronize: true` faz o TypeORM alterar o esquema na subida. Num laboratório só em localhost o alcance é a própria máquina. Num host exposto, a nota base é 9.8: a credencial é pública e o usuário do banco é dono dos dados da aplicação.
2. **CORS.** `enableCors` reflete qualquer `Origin` e envia `credentials: true`. Não há lista de origens. O cookie atual é `SameSite=Lax`, o que impede o navegador de anexá-lo em chamada cross-site feita por script. A política do servidor, ainda assim, autoriza qualquer origem a ler a resposta numa requisição credenciada. Se o cookie passar a `SameSite=None` ou se um cliente não navegador ignorar essa política, a reflexão de origem passa a valer. Nota 5.4 com interação da vítima, porque o Lax reduz o abuso a partir de outro site.
3. **Swagger.** `SwaggerModule.setup('api/docs', ...)` não tem autenticação. Revela rotas, DTOs e o exemplo de e-mail do administrador. Severidade informativa a baixa, útil como mapa para os outros achados.
4. **Cookie.** Flags fracas estão detalhadas no ACH-04. Entram aqui só como configuração da sessão.

Não há cabeçalho de endurecimento (Helmet ou equivalente) nem limite de taxa. São ausências de defesa. A severidade desta ficha não depende delas.

## Pré-condições

- Compose do laboratório em execução, para o item do banco.
- Para medir o alcance real da porta 5432: observar o bind e o firewall do host. Sem essa observação, o relatório não afirma que o banco está na internet.

## Confirmação

1. Ler a publicação de porta e a senha padrão no compose.
2. Ler o callback de CORS que devolve o `Origin` recebido.
3. Abrir `/api/docs` sem sessão e registrar que a documentação responde.

Não usar a credencial padrão contra outro host que não seja o laboratório do grupo.

## Impacto

Se a porta 5432 aceita conexão de fora da máquina, o banco inteiro fica legível e gravável com a senha do repositório, à margem das correções da API. O CORS reflexivo amplia a origem autorizada a ler respostas credenciadas. O Swagger encurta o reconhecimento da superfície.

## Recomendação

- Não publicar 5432 fora da rede do compose. Senha só por ambiente, diferente do exemplo.
- Desligar `synchronize` fora do laboratório e versionar o esquema por migração.
- Lista explícita de origens no CORS. Evitar refletir o cabeçalho `Origin` com credenciais.
- Restringir `/api/docs` ao ambiente de desenvolvimento.
- Limite de tentativas no login, como defesa complementar do ACH-04.

## Correção Aplicada

Patch 7 em `docs/correcoes/PATCHES.md` (compose, CORS e Swagger). Não aplicado.

## Reteste previsto

- A partir de outra máquina, a porta 5432 do laboratório não aceita conexão, ou exige senha que não é a do exemplo.
- Uma origem que não está na lista não recebe `Access-Control-Allow-Origin` igual ao `Origin` enviado, com `Allow-Credentials: true`.
- `/api/docs` não responde no ambiente que o grupo tratar como produção.

## Critério de Aceite (Checklist)

- [x] Falha identificável pela configuração citada
- [x] Vetor CVSS 3.1 completo, com a condição de alcance declarada
- [ ] Evidência de bind/firewall do laboratório
- [x] Impacto concreto
- [ ] Reteste executado
