# Tasks

## Remover recursos AWS

- [x] Deletar `aws-cdn.tf`
- [x] Deletar `aws-dns.tf`
- [x] Deletar `cloudfront-function.js`

## Atualizar main.tf

- [x] Remover provider AWS e alias us_east_1
- [x] Manter apenas digitalocean e random providers

## Atualizar variables.tf

- [x] Remover variáveis: origin_secret, basic_auth_user, basic_auth_pass
- [x] Atualizar domain default para sigacad.com.br

## Atualizar do-compute.tf

- [x] Remover comentários sobre CloudFront no firewall
- [x] Atualizar cloud-init para criar diretório /var/www/frontend

## Atualizar Caddyfile.tpl

- [x] Configurar servir arquivos estáticos de /var/www/frontend
- [x] Configurar proxy reverso /api/* para localhost:3000
- [x] Remover verificação de origin_secret

## Atualizar cloud-init.yaml

- [x] Adicionar criação do diretório /var/www/frontend
- [x] Configurar permissões adequadas

## Atualizar outputs.tf

- [x] Remover outputs AWS (s3_bucket, cloudfront_domain, etc)
- [x] Adicionar output do IP público do droplet
- [x] Adicionar instruções DNS para registro.br

## Atualizar terraform.tfvars.example

- [x] Remover variáveis AWS
- [x] Atualizar exemplo com domain = sigacad.com.br

## Documentação

- [x] Atualizar README.md com nova arquitetura
- [x] Adicionar instruções de deploy do frontend via SCP
