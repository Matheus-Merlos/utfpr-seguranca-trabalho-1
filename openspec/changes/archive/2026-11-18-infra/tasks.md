# Tasks

## Estrutura base

- [x] Criar `infra/` com .gitignore (*.tfstate, *.tfvars, .terraform/)
- [x] Criar `infra/main.tf` com providers AWS e DigitalOcean
- [x] Criar `infra/variables.tf` com todas as variáveis de entrada
- [x] Criar `infra/outputs.tf` com IP do droplet e URL do CloudFront
- [x] Criar `infra/terraform.tfvars.example` com placeholders

## AWS - DNS e Certificado

- [x] Criar `infra/aws-dns.tf` com Route53 zone e records
- [x] Adicionar ACM certificate em us-east-1 com validação DNS
- [x] Adicionar record de validação do certificado

## AWS - CDN e Storage

- [x] Criar `infra/aws-cdn.tf` com S3 bucket privado
- [x] Adicionar Origin Access Control para S3
- [x] Adicionar bucket policy permitindo acesso via OAC
- [x] Criar CloudFront distribution com dois origins (S3 e DO)
- [x] Configurar behavior default (/*) apontando para S3 com fallback SPA
- [x] Configurar behavior /api/* apontando para DO com CachingDisabled
- [x] Criar `infra/cloudfront-function.js` com basic auth
- [x] Associar function a viewer-request em ambos behaviors
- [x] Adicionar custom header X-Origin-Secret na origin DO

## DigitalOcean - Compute

- [x] Criar `infra/do-compute.tf` com VPC
- [x] Adicionar Firewall com regras (SSH owner-only, 80/443 public)
- [x] Adicionar SSH key resource
- [x] Criar Droplet Ubuntu 22.04 com cloud-init
- [x] Criar `infra/cloud-init.yaml` instalando Docker e Caddy
- [x] Criar `infra/Caddyfile.tpl` com verificação de X-Origin-Secret

## DNS Records

- [x] Adicionar A record para domínio principal → CloudFront
- [x] Adicionar A record para api-origin.dominio → IP do Droplet

## Verificação

- [x] Rodar `terraform validate` sem erros
- [x] Rodar `terraform plan` e revisar recursos criados
- [x] Documentar próximos passos no README (terraform apply requer autorização)
