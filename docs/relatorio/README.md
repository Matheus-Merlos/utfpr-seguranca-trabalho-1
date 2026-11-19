# Relatório Final de Auditoria

## O que entregar aqui

Esta pasta contém o **relatório final consolidado** da auditoria de segurança.

## Como criar o relatório

1. Copie o template:
   ```bash
   cp ../templates/TEMPLATE-RELATORIO.md relatorio-final.md
   ```

2. Preencha todas as seções do template

3. Para a seção "Achados Detalhados", copie o conteúdo de cada `docs/achados/ACH-XX-*/achado.md`

4. Revise e formate o documento final

## Estrutura esperada

```
relatorio/
├── README.md              (este arquivo)
└── relatorio-final.md     (relatório consolidado)
```

## Checklist antes de entregar

- [ ] Capa com nome do grupo, data e versão
- [ ] Sumário executivo compreensível para não-técnicos
- [ ] Tabela-resumo com todos os achados
- [ ] Fichas completas de cada achado
- [ ] Correções e retestes documentados
- [ ] Limitações declaradas
- [ ] Recomendações gerais

## Dicas

- **Sumário executivo**: Escreva por último, após ter todos os achados documentados
- **Tabela-resumo**: Use para dar visão geral antes do detalhamento
- **Ordem dos achados**: Do mais crítico para o menos crítico
- **Revisão por pares**: Peça para outro membro revisar antes de finalizar
