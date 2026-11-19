# Proposal: CI/CD com GitHub Actions

## Objetivo

Criar pipelines de CI/CD simples:

1. **CI (Pull Requests)**: Validar código ao abrir PRs
   - Lint e build do backend
   - Build do frontend

2. **CD (Push to main)**: Deploy automático para produção
   - Build e push das imagens Docker para Docker Hub
   - Deploy do frontend via SCP para o droplet
   - Restart dos containers no servidor

## Escopo

- GitHub Actions workflows
- Dockerfiles para produção
- docker-compose para produção
- Documentação dos secrets necessários

## Fora de escopo

- Ambiente de staging/teste
- Testes automatizados (não existem)
- Rollback automático
