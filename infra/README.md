# SIGAcad Infrastructure

Terraform para provisionar a infraestrutura do SIGAcad na DigitalOcean.

## Arquitetura

```
                        Internet
                            │
                            ▼
              ┌─────────────────────────────────────────┐
              │          DigitalOcean VPC               │
              │          (10.10.10.0/24)                │
              │                                         │
              │    Droplet (sigacad.com.br)            │
              │    ├─ Caddy (443/80) → HTTPS           │
              │    │  ├─ /api/* → localhost:3000       │
              │    │  └─ /* → /var/www/frontend        │
              │    │                                    │
              │    └─ Docker Compose                   │
              │       ├─ api (NestJS)                  │
              │       └─ postgres                      │
              └─────────────────────────────────────────┘
```

## Pré-requisitos

1. Terraform >= 1.0
2. Token da DigitalOcean
3. Domínio sigacad.com.br (DNS gerenciado no registro.br)

## Uso

1. Copie o arquivo de exemplo:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Edite `terraform.tfvars` com seus valores:
   - `domain`: sigacad.com.br (ou seu domínio)
   - `do_token`: token da DigitalOcean
   - `owner_ip`: seu IP para acesso SSH (ex: 203.0.113.50/32)
   - `ssh_public_key`: sua chave SSH pública

3. Inicialize e planeje:
   ```bash
   terraform init
   terraform plan
   ```

4. **Aplique apenas com autorização:**
   ```bash
   terraform apply
   ```

5. Configure os registros DNS no registro.br:
   ```
   Tipo    Nome                    Valor
   A       sigacad.com.br          <IP do droplet>
   CNAME   www.sigacad.com.br      sigacad.com.br
   ```

## Outputs

- `droplet_ip`: IP do servidor
- `app_url`: URL da aplicação (https://sigacad.com.br)
- `dns_instructions`: instruções para DNS
- `deploy_instructions`: instruções para deploy

## Deploy da aplicação

Após `terraform apply` e configuração do DNS:

### Frontend

```bash
cd frontend
npm run build
scp -r dist/* root@<DROPLET_IP>:/var/www/frontend/
```

### Backend

```bash
scp docker-compose.yml root@<DROPLET_IP>:/opt/sigacad/
ssh root@<DROPLET_IP> 'cd /opt/sigacad && cp .env.example .env && ./deploy.sh'
```

Ou clone o repositório diretamente no servidor:

```bash
ssh root@<DROPLET_IP>
cd /opt/sigacad
git clone <repo-url> .
cp .env.example .env
# edite .env com as credenciais
./deploy.sh
```

## Custos estimados

- **DigitalOcean**: ~$6/mês (Droplet s-1vcpu-1gb)

Desligue os recursos após a auditoria para evitar custos.

## Destruição

```bash
terraform destroy
```
