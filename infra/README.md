# SIGAcad Infrastructure

Terraform para provisionar a infraestrutura do SIGAcad na AWS e DigitalOcean.

## Arquitetura

```
                    CloudFront (CDN + Basic Auth)
                    ┌─────────────────────────────┐
                    │  /*  → S3 (frontend)        │
                    │  /api/* → DO Droplet (API)  │
                    └─────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                                   ▼
     ┌─────────────┐                    ┌─────────────┐
     │   S3 (OAC)  │                    │   Droplet   │
     │   Frontend  │                    │ Caddy + API │
     └─────────────┘                    └─────────────┘
```

## Pré-requisitos

1. Terraform >= 1.0
2. Conta AWS com credenciais configuradas
3. Token da DigitalOcean
4. Domínio configurado (nameservers serão fornecidos após apply)

## Uso

1. Copie o arquivo de exemplo:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Edite `terraform.tfvars` com seus valores:
   - `domain`: seu domínio
   - `do_token`: token da DigitalOcean
   - `owner_ip`: seu IP para acesso SSH
   - `origin_secret`: segredo aleatório
   - `basic_auth_user/pass`: credenciais do basic auth
   - `ssh_public_key`: sua chave SSH pública

3. Inicialize e planeje:
   ```bash
   terraform init
   terraform plan
   ```

4. **Aplique apenas com autorização do professor:**
   ```bash
   terraform apply
   ```

5. Configure os nameservers do Route53 no seu registrar de domínio.

## Outputs

- `cloudfront_url`: URL principal do site
- `droplet_ip`: IP do servidor para SSH
- `nameservers`: nameservers para configurar no registrar

## Deploy da aplicação

Após `terraform apply`:

1. SSH no droplet:
   ```bash
   ssh root@$(terraform output -raw droplet_ip)
   ```

2. Clone o repo e configure:
   ```bash
   cd /opt/sigacad
   git clone <repo-url> .
   cp .env.example .env
   # edite .env com as credenciais do banco
   ```

3. Deploy:
   ```bash
   ./deploy.sh
   ```

## Custos estimados

- **AWS**: ~$1-2/mês (S3, CloudFront, Route53)
- **DigitalOcean**: ~$6/mês (Droplet s-1vcpu-1gb)

Desligue os recursos após a auditoria para evitar custos.

## Destruição

```bash
terraform destroy
```
