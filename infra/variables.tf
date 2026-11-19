variable "domain" {
  description = "Domínio principal (ex: sigacad.com.br)"
  type        = string
  default     = "sigacad.com.br"
}

variable "do_token" {
  description = "Token de API da DigitalOcean"
  type        = string
  sensitive   = true
}

variable "droplet_size" {
  description = "Tamanho do Droplet"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "droplet_region" {
  description = "Região do Droplet"
  type        = string
  default     = "nyc3"
}
