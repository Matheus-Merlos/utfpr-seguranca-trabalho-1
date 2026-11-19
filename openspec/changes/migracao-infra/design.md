# Design: Infra DigitalOcean simplificada

## Arquitetura

```
                    ┌─────────────────────────────────────────┐
                    │          DigitalOcean VPC               │
                    │          (10.10.10.0/24)                │
                    │                                         │
 Internet ──────────┼──► Droplet (IP público)                │
                    │    ├─ Caddy (443/80) ─► HTTPS          │
                    │    │  ├─ /api/* ──► localhost:3000     │
                    │    │  └─ /* ──────► /var/www/frontend  │
                    │    │                                    │
                    │    └─ Docker Compose                   │
                    │       ├─ api (NestJS)                  │
                    │       └─ postgres                      │
                    └─────────────────────────────────────────┘
```

## Arquivos Terraform a remover

- `aws-cdn.tf` - CloudFront, S3, ACM
- `aws-dns.tf` - Route53
- `cloudfront-function.js` - Basic auth function

## Arquivos Terraform a modificar

### `main.tf`
- Remover providers AWS
- Manter apenas digitalocean e random

### `variables.tf`
- Remover: `origin_secret`, `basic_auth_user`, `basic_auth_pass`
- Manter: `domain`, `do_token`, `owner_ip`, `ssh_public_key`, `droplet_size`, `droplet_region`

### `do-compute.tf`
- Atualizar firewall (remover comentários sobre CloudFront)
- Atualizar cloud-init para incluir deploy do frontend

### `outputs.tf`
- Remover outputs AWS
- Adicionar: IP público do droplet, instruções DNS

### `Caddyfile.tpl`
- Configurar para servir frontend estático em `/`
- Proxy reverso para API em `/api/*`
- Let's Encrypt automático

### `cloud-init.yaml`
- Adicionar deploy do frontend build
- Configurar diretório `/var/www/frontend`

## DNS (manual no registro.br)

Registros a criar:
```
sigacad.com.br.     A     <droplet_ip>
www.sigacad.com.br. CNAME sigacad.com.br.
```

## Deploy do frontend

O build do frontend será copiado para o droplet via SCP ou incluído no cloud-init. Caddy servirá os arquivos estáticos de `/var/www/frontend`.
