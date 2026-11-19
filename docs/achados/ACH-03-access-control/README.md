# ACH-03 - Broken Access Control

## O que documentar aqui

Esta pasta é destinada a achados de **Controle de Acesso Quebrado**, incluindo:
- IDOR (Insecure Direct Object Reference)
- Escalação de privilégios
- Bypass de autorização
- Mass Assignment

## Estrutura

```
ACH-03-access-control/
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

- **OWASP Top 10:2025:** A01 Broken Access Control
- **CWE:** CWE-639 (IDOR), CWE-862 (Missing Authorization), CWE-915 (Mass Assignment)
- **WSTG:** WSTG-ATHZ-01 Testing Directory Traversal, WSTG-ATHZ-02 Testing for Bypassing Authorization Schema

## Nomenclatura de evidências

| Padrão | Exemplo | Uso |
|--------|---------|-----|
| `evXX-usuario-*.png` | `ev01-usuario-normal.png` | Ação como usuário sem privilégio |
| `evXX-acesso-*.png` | `ev02-acesso-admin.png` | Acesso indevido obtido |
| `evXX-burp-*.png` | `ev03-burp-idor.png` | Manipulação de ID no Burp |
| `evXX-dados-*.png` | `ev04-dados-outro-usuario.png` | Dados de outro usuário expostos |
