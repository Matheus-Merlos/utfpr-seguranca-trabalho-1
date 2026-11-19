variable "domain" {
  description = "Domínio principal (ex: sigacad.exemplo.com)"
  type        = string
}

variable "do_token" {
  description = "Token de API da DigitalOcean"
  type        = string
  sensitive   = true
}

variable "owner_ip" {
  description = "IP do dono para acesso SSH (ex: 203.0.113.50/32)"
  type        = string
}

variable "origin_secret" {
  description = "Header secreto para proteção de origem CloudFront -> DO"
  type        = string
  sensitive   = true
}

variable "basic_auth_user" {
  description = "Usuário para basic auth do CloudFront"
  type        = string
}

variable "basic_auth_pass" {
  description = "Senha para basic auth do CloudFront"
  type        = string
  sensitive   = true
}

variable "ssh_public_key" {
  description = "Chave SSH pública para acesso ao Droplet"
  type        = string
}

variable "droplet_size" {
  description = "Tamanho do Droplet"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "droplet_region" {
  description = "Região do Droplet"
  type        = string
  default     = "nyc1"
}
