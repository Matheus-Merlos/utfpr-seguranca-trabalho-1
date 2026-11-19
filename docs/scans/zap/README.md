# Relatórios OWASP ZAP

## O que entregar aqui

Esta pasta é destinada aos **relatórios automatizados do OWASP ZAP**.

## Arquivos esperados

```
zap/
├── README.md                    (este arquivo)
├── zap-report-AAAA-MM-DD.html   (relatório HTML para leitura)
├── zap-report-AAAA-MM-DD.xml    (relatório XML para parsing)
└── zap-alerts-AAAA-MM-DD.json   (alertas em JSON, opcional)
```

## Como gerar o relatório

1. Abra o OWASP ZAP
2. Configure o proxy e navegue pela aplicação (ou use o Spider)
3. Execute o Active Scan nos endpoints descobertos
4. Vá em **Report > Generate Report...**
5. Selecione o formato (HTML para leitura, XML para parsing)
6. Salve nesta pasta com o padrão de nomenclatura

## Nomenclatura

Use o padrão: `zap-<tipo>-AAAA-MM-DD.<extensão>`

Exemplos:
- `zap-report-2024-03-15.html`
- `zap-report-2024-03-15.xml`
- `zap-alerts-2024-03-15.json`

## Configurações recomendadas

- **Scan Policy:** Default ou personalizada para a aplicação
- **Strength:** Medium (High pode gerar muitos falsos positivos)
- **Threshold:** Medium

## Importante

- O relatório do ZAP pode conter **falsos positivos**. Valide manualmente cada achado antes de documentar.
- Inclua a data do scan no nome do arquivo para rastreabilidade.
- Se houver múltiplos scans, mantenha todos com datas diferentes.
