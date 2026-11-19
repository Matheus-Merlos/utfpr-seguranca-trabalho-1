# ACH-04 - Autenticação e Sessão

## O que documentar aqui

Esta pasta é destinada a achados de **Falhas de Autenticação e Gerenciamento de Sessão**, incluindo:
- Senhas fracas ou previsíveis
- Tokens JWT inseguros
- Cookies sem flags de segurança
- Falta de rate limiting
- Recuperação de senha insegura
- Enumeração de usuários

## Estrutura

```
ACH-04-auth-sessao/
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

- **OWASP Top 10:2025:** A07 Identification and Authentication Failures
- **CWE:** CWE-287 (Improper Authentication), CWE-384 (Session Fixation), CWE-614 (Cookie without Secure Flag)
- **WSTG:** WSTG-ATHN-01 Testing for Credentials, WSTG-SESS-01 Testing for Session Management

## Nomenclatura de evidências

| Padrão | Exemplo | Uso |
|--------|---------|-----|
| `evXX-jwt-*.png` | `ev01-jwt-decoded.png` | Token JWT decodificado |
| `evXX-cookie-*.png` | `ev02-cookie-flags.png` | Flags do cookie no DevTools |
| `evXX-brute-*.png` | `ev03-brute-force.png` | Tentativas de força bruta |
| `evXX-enumeracao-*.png` | `ev04-enumeracao-usuario.png` | Mensagens diferentes para user/senha |
