output "droplet_ip" {
  description = "IP público do Droplet"
  value       = digitalocean_droplet.api.ipv4_address
}

output "droplet_public_key" {
  description = "Chave SSH publica do droplet"
  value       = digitalocean_ssh_key.sigacad_ssh_key.public_key
}

output "droplet_secret_key" {
  description = "Chave SSH privada do droplet"
  sensitive   = true
  value       = tls_private_key.sigacad_key.private_key_openssh
}

output "app_url" {
  description = "URL da aplicação"
  value       = "https://${var.domain}"
}

output "dns_instructions" {
  description = "Instruções para configurar DNS no registro.br"
  value       = <<-EOT

    Configure os seguintes registros DNS no registro.br:

    Tipo    Nome                    Valor
    ----    ----                    -----
    A       sigacad.com.br          ${digitalocean_droplet.api.ipv4_address}
    CNAME   www.sigacad.com.br      sigacad.com.br

    Após configurar, aguarde a propagação DNS (pode levar até 24h).

  EOT
}

output "deploy_instructions" {
  description = "Instruções para deploy"
  value       = <<-EOT

    Deploy do frontend:
    $ cd frontend && npm run build
    $ scp -r dist/* root@${digitalocean_droplet.api.ipv4_address}:/var/www/frontend/

    Deploy do backend:
    $ scp docker-compose.yml root@${digitalocean_droplet.api.ipv4_address}:/opt/sigacad/
    $ ssh root@${digitalocean_droplet.api.ipv4_address} 'cd /opt/sigacad && ./deploy.sh'

  EOT
}
