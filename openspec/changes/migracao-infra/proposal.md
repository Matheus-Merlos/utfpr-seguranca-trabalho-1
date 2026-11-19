# Proposal: Migração para Droplet único

## Situação atual

A infra atual usa:
- AWS S3 para hospedar o frontend
- AWS CloudFront como CDN com ACM certificate
- AWS Route53 para DNS
- DigitalOcean Droplet para API
- CloudFront Function para Basic Auth

## Objetivo

Simplificar para usar **somente um Droplet na DigitalOcean**:
- Um droplet rodando frontend (Caddy serve arquivos estáticos) + backend (Docker)
- VPC dedicada com IP público
- Caddy com Let's Encrypt para HTTPS automático
- Domínio: **sigacad.com.br** (DNS gerenciado manualmente no registro.br)

## Motivação

- Reduzir custos e complexidade
- Eliminar dependência de AWS
- Facilitar deploy e manutenção
- Projeto acadêmico não precisa de CDN global

## Fora de escopo

- Gestão de DNS via Terraform (será manual no registro.br)
- Load balancer ou escalabilidade
- Backup automatizado
