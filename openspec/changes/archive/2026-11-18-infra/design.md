## Context

O SIGAcad precisa de infraestrutura de produção que exponha a aplicação publicamente, mas com proteção básica (basic auth) para evitar acesso não autorizado durante o período de auditoria.

## Goals / Non-Goals

**Goals:**
- Provisionar infraestrutura completa com Terraform
- Frontend estático no S3 via CloudFront
- Backend na DigitalOcean com Docker
- Basic auth em todos os endpoints
- Proteção de origem (evitar bypass do CloudFront)

**Non-Goals:**
- AWS WAF (bloquearia payloads)
- Alta disponibilidade
- Auto-scaling
- Monitoramento avançado

## Decisions

### D1: Arquitetura geral

```
┌─────────────────────────────────────────────────────────────────┐
│                         CloudFront                              │
│  ┌─────────────────┐              ┌─────────────────┐           │
│  │ /* (default)    │              │ /api/*          │           │
│  │ → S3 Origin     │              │ → DO Origin     │           │
│  └────────┬────────┘              └────────┬────────┘           │
│           │                                │                    │
│     CloudFront Function (basic auth)       │                    │
│           │                                │                    │
└───────────┼────────────────────────────────┼────────────────────┘
            │                                │
            ▼                                ▼
     ┌──────────────┐               ┌──────────────┐
     │   S3 (OAC)   │               │   Droplet    │
     │   Frontend   │               │   Backend    │
     └──────────────┘               │   (Caddy)    │
                                    └──────────────┘
```

### D2: AWS - Certificado e DNS

- Route53 como DNS autoritativo
- ACM em us-east-1 (requisito do CloudFront)
- Validação DNS automática

```hcl
resource "aws_acm_certificate" "main" {
  provider          = aws.us_east_1
  domain_name       = var.domain
  validation_method = "DNS"
}
```

### D3: AWS - S3 com OAC

Bucket privado, acesso apenas via CloudFront com Origin Access Control:

```hcl
resource "aws_s3_bucket" "frontend" {
  bucket = "sigacad-frontend-${random_id.suffix.hex}"
}

resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "sigacad-s3-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
```

### D4: CloudFront - Dois behaviors

1. **Default (/**)**: S3 origin, fallback 403/404 → /index.html (SPA)
2. **/api/***: Custom origin → api-origin.dominio, CachingDisabled, AllViewerExceptHostHeader

```hcl
origin {
  domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
  origin_id   = "s3-frontend"
  origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
}

origin {
  domain_name = "api-origin.${var.domain}"
  origin_id   = "do-api"
  
  custom_origin_config {
    http_port              = 80
    https_port             = 443
    origin_protocol_policy = "https-only"
    origin_ssl_protocols   = ["TLSv1.2"]
  }
  
  custom_header {
    name  = "X-Origin-Secret"
    value = var.origin_secret
  }
}
```

### D5: CloudFront Function - Basic Auth

```javascript
function handler(event) {
  var request = event.request;
  var headers = request.headers;
  var authString = "Basic " + "USER:PASS".toString("base64");
  
  if (!headers.authorization || headers.authorization.value !== authString) {
    return {
      statusCode: 401,
      headers: { "www-authenticate": { value: "Basic realm='SIGAcad'" } }
    };
  }
  return request;
}
```

Associada a viewer-request em ambos os behaviors.

### D6: DigitalOcean - Droplet

Ubuntu 22.04 com Docker pré-instalado. Cloud-init:

```yaml
#cloud-config
packages:
  - docker.io
  - docker-compose
runcmd:
  - systemctl enable docker
  - curl -fsSL https://caddyserver.com/api/download?os=linux&arch=amd64 -o /usr/bin/caddy
  - chmod +x /usr/bin/caddy
```

### D7: DigitalOcean - VPC e Firewall

VPC isolada. Firewall rules:

| Direction | Protocol | Port | Source |
|-----------|----------|------|--------|
| Inbound   | TCP      | 22   | var.owner_ip |
| Inbound   | TCP      | 80   | 0.0.0.0/0 |
| Inbound   | TCP      | 443  | 0.0.0.0/0 |
| Outbound  | TCP      | ALL  | 0.0.0.0/0 |
| Outbound  | UDP      | ALL  | 0.0.0.0/0 |

### D8: Caddy - Reverse Proxy com verificação de origem

```caddyfile
api-origin.{$DOMAIN} {
  @blocked {
    not header X-Origin-Secret {$ORIGIN_SECRET}
  }
  respond @blocked 403
  
  reverse_proxy localhost:3000
}
```

### D9: Estrutura de arquivos

```
infra/
├── main.tf           # Provider configs
├── variables.tf      # Input variables
├── outputs.tf        # Outputs (IP, URL)
├── aws-dns.tf        # Route53, ACM
├── aws-cdn.tf        # CloudFront, S3
├── do-compute.tf     # Droplet, VPC, Firewall
├── cloudfront-function.js
├── cloud-init.yaml
├── Caddyfile.tpl
├── terraform.tfvars.example
└── .gitignore
```

### D10: Variáveis

```hcl
variable "domain" {}
variable "do_token" { sensitive = true }
variable "owner_ip" {}
variable "origin_secret" { sensitive = true }
variable "basic_auth_user" {}
variable "basic_auth_pass" { sensitive = true }
variable "ssh_public_key" {}
```

## Risks / Trade-offs

| Risco | Mitigação |
|-------|-----------|
| Custos AWS/DO | Recursos mínimos, pode desligar após auditoria |
| Sem WAF | Intencional (permitir payloads) |
| Single point of failure | Aceitável para laboratório |
| Credenciais no Terraform state | .gitignore em .tfstate, usar backend remoto se necessário |

## Open Questions

Nenhuma — a arquitetura está consolidada.
