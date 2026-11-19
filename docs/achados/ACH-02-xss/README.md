# ACH-02 - Cross-Site Scripting (XSS)

## O que documentar aqui

Esta pasta é destinada a achados de **Cross-Site Scripting (XSS)**, incluindo:
- XSS Refletido
- XSS Armazenado (Stored/Persistent)
- XSS Baseado em DOM

## Estrutura

```
ACH-02-xss/
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
- **CWE:** CWE-79 (XSS), CWE-80 (Basic XSS)
- **WSTG:** WSTG-INPV-01 Testing for Reflected XSS, WSTG-INPV-02 Testing for Stored XSS

## Nomenclatura de evidências

| Padrão | Exemplo | Uso |
|--------|---------|-----|
| `evXX-payload-*.png` | `ev01-payload-inserido.png` | Payload sendo inserido |
| `evXX-execucao-*.png` | `ev02-execucao-alert.png` | Script executando |
| `evXX-burp-*.png` | `ev03-burp-response.png` | Request/response no Burp |
| `evXX-cookie-*.png` | `ev04-cookie-roubado.png` | Demonstração de impacto |
