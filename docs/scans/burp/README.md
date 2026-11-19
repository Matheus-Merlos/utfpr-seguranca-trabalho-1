# Evidências Burp Suite Community

## ⚠️ Importante: Burp Community NÃO tem Scanner Automático

O **Burp Suite Community Edition** é gratuito, mas **não inclui o scanner automático de vulnerabilidades**. O scanner é exclusivo da versão Professional (paga).

## O que entregar aqui

Como não há relatório automático, você deve entregar:

1. **Histórico do Proxy** - Exportação das requisições capturadas
2. **Screenshots da navegação manual** - Prints da análise feita no Repeater/Intruder
3. **Arquivos de projeto** (opcional) - Projeto do Burp para referência

## Arquivos esperados

```
burp/
├── README.md                        (este arquivo)
├── proxy-history-AAAA-MM-DD.xml     (histórico exportado)
├── screenshots/
│   ├── burp-01-proxy-overview.png   (visão geral do proxy)
│   ├── burp-02-repeater-test.png    (teste no Repeater)
│   └── burp-03-intruder-setup.png   (configuração do Intruder)
└── projeto-burp-AAAA-MM-DD.burp     (arquivo de projeto, opcional)
```

## Como exportar o histórico do Proxy

1. No Burp, vá em **Proxy > HTTP history**
2. Selecione todas as requisições (Ctrl+A)
3. Clique com botão direito > **Save items**
4. Salve como XML nesta pasta

## Screenshots recomendados

| Screenshot | Descrição |
|------------|-----------|
| `burp-proxy-overview.png` | Visão geral das requisições capturadas |
| `burp-repeater-*.png` | Testes manuais feitos no Repeater |
| `burp-intruder-*.png` | Configuração de ataques no Intruder |
| `burp-decoder-*.png` | Análise de tokens/encoding |

## Para relatório automatizado, use o ZAP

O relatório automatizado de vulnerabilidades deve vir do **OWASP ZAP**, que é gratuito e possui scanner.

Veja: `docs/scans/zap/README.md`

## Nomenclatura

Use o padrão: `<tipo>-AAAA-MM-DD.<extensão>`

Exemplos:
- `proxy-history-2024-03-15.xml`
- `projeto-burp-2024-03-15.burp`
