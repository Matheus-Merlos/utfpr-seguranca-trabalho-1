## Why

Este change provisiona a infraestrutura de produção do SIGAcad usando Terraform. A aplicação será exposta publicamente para que os colegas possam auditar as vulnerabilidades plantadas.

## What Changes

- Configurar AWS: Route53, ACM (certificado), S3 (frontend), CloudFront (CDN)
- Configurar DigitalOcean: Droplet (backend), VPC, Firewall
- CloudFront com basic auth via CloudFront Function
- Proteção de origem com header secreto (X-Origin-Secret)
- Caddy como reverse proxy na VM

## Vulnerabilidades implementadas

Nenhuma — este change é infraestrutura pura. As vulnerabilidades estão nos changes de código.

## Fora de escopo

- AWS WAF (bloquearia payloads do laboratório)
- Backups automatizados
- Monitoramento/alertas
- CI/CD pipeline
- Múltiplos ambientes (apenas produção)

## Capabilities

### New Capabilities

- `aws-network`: Route53, ACM, CloudFront com OAC para S3
- `do-compute`: Droplet Ubuntu com Docker, Caddy, Firewall
- `origin-protection`: Header secreto entre CloudFront e VM

### Modified Capabilities

(nenhuma)

## Impact

- Cria recursos na AWS (Route53, S3, CloudFront, ACM)
- Cria recursos na DigitalOcean (Droplet, VPC, Firewall)
- Requer variáveis sensíveis (tokens, domínio, IP do dono)
