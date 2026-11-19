output "cloudfront_domain" {
  description = "Domínio do CloudFront"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_url" {
  description = "URL do CloudFront"
  value       = "https://${var.domain}"
}

output "droplet_ip" {
  description = "IP público do Droplet"
  value       = digitalocean_droplet.api.ipv4_address
}

output "api_origin_domain" {
  description = "Domínio da origem da API"
  value       = "api-origin.${var.domain}"
}

output "s3_bucket" {
  description = "Nome do bucket S3"
  value       = aws_s3_bucket.frontend.bucket
}

output "nameservers" {
  description = "Nameservers do Route53 (configurar no registrar)"
  value       = aws_route53_zone.main.name_servers
}
