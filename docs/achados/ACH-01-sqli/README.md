# ACH-01 - SQL Injection

## O que documentar aqui

Esta pasta é destinada a achados de **SQL Injection** e outras vulnerabilidades de injeção em banco de dados.

## Estrutura

```
ACH-01-sqli/
├── README.md          (este arquivo)
├── achado.md          (ficha preenchida a partir do template)
└── evidencias/        (screenshots e arquivos de evidência)
    ├── ev01-*.png
    ├── ev02-*.png
    └── ...
```

## Como usar

1. Copie `docs/templates/TEMPLATE-ACHADO.md` para `achado.md`
2. Preencha todos os campos obrigatórios
3. Salve evidências em `evidencias/` seguindo o padrão `evXX-descricao.png`
4. Verifique o checklist de aceite antes de submeter

## Categorias relacionadas

- **OWASP Top 10:2025:** A03 Injection
- **CWE:** CWE-89 (SQL Injection), CWE-564 (Hibernate Injection)
- **WSTG:** WSTG-INPV-05 Testing for SQL Injection

## Nomenclatura de evidências

| Padrão | Exemplo | Uso |
|--------|---------|-----|
| `evXX-tela-*.png` | `ev01-tela-login.png` | Screenshot da interface |
| `evXX-burp-*.png` | `ev02-burp-request.png` | Captura do Burp Proxy |
| `evXX-sqlmap-*.png` | `ev03-sqlmap-output.png` | Output de ferramentas |
| `evXX-reteste-*.png` | `ev04-reteste-local.png` | Validação pós-correção |
