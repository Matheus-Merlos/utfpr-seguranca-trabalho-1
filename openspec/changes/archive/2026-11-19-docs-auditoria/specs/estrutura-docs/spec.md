## ADDED Requirements

### Requirement: Estrutura de pastas para achados

O repositório DEVE ter a seguinte estrutura de pastas para achados:

```
docs/achados/
├── ACH-01-sqli/
│   ├── achado.md
│   └── evidencias/
├── ACH-02-xss/
│   ├── achado.md
│   └── evidencias/
├── ACH-03-access-control/
│   ├── achado.md
│   └── evidencias/
└── ACH-04-auth-sessao/
    ├── achado.md
    └── evidencias/
```

Cada pasta DEVE conter um README explicando o que entregar.

#### Scenario: Auditor sabe onde documentar SQLi

- **WHEN** auditor encontra vulnerabilidade de SQL Injection
- **THEN** documenta em `docs/achados/ACH-01-sqli/achado.md`
- **AND** salva evidências em `docs/achados/ACH-01-sqli/evidencias/`

### Requirement: Estrutura de pastas para scans

O repositório DEVE ter a seguinte estrutura para relatórios de scan:

```
docs/scans/
├── zap/
│   └── README.md
└── burp/
    └── README.md
```

#### Scenario: Entrega de relatório ZAP

- **WHEN** auditor executa scan automático com OWASP ZAP
- **THEN** salva relatório HTML/XML em `docs/scans/zap/`

### Requirement: Aviso sobre Burp Community

O README de `docs/scans/burp/` DEVE informar que o Burp Suite Community Edition não possui scanner automático. O auditor DEVE entregar:
- Histórico do proxy exportado
- Screenshots da navegação manual
- O relatório automatizado sai apenas do ZAP

#### Scenario: Auditor entende limitação do Burp Community

- **WHEN** auditor lê o README de docs/scans/burp/
- **THEN** entende que deve exportar histórico do proxy
- **AND** entende que prints manuais são necessários
- **AND** entende que relatório automático vem do ZAP, não do Burp

### Requirement: Estrutura de pastas para relatório final

O repositório DEVE ter pasta dedicada ao relatório:

```
docs/relatorio/
└── README.md
```

O README DEVE instruir a criar `relatorio-final.md` a partir do template.

#### Scenario: Geração do relatório final

- **WHEN** grupo está pronto para gerar relatório final
- **THEN** copia template para `docs/relatorio/relatorio-final.md`
- **AND** preenche todas as seções com dados dos achados

### Requirement: READMEs explicativos em cada pasta

Cada pasta da estrutura DEVE conter README.md curto explicando:
- O que deve ser entregue naquela pasta
- Formato esperado dos arquivos
- Convenção de nomenclatura

#### Scenario: Novo membro entende a estrutura

- **WHEN** novo membro do grupo acessa a pasta docs/
- **THEN** consegue entender a organização lendo os READMEs
- **AND** sabe exatamente onde colocar cada tipo de arquivo
