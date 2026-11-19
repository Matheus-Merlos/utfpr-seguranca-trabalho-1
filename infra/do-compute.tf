# VPC
resource "digitalocean_vpc" "main" {
  name     = "sigacad-vpc"
  region   = var.droplet_region
  ip_range = "10.10.10.0/24"
}

# SSH Key
resource "digitalocean_ssh_key" "main" {
  name       = "sigacad-key"
  public_key = var.ssh_public_key
}

# Firewall
resource "digitalocean_firewall" "main" {
  name = "sigacad-firewall"

  droplet_ids = [digitalocean_droplet.api.id]

  # SSH only from owner IP
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = [var.owner_ip]
  }

  # HTTP from anywhere (CloudFront)
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS from anywhere (CloudFront)
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Allow all outbound TCP
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Allow all outbound UDP
  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Allow ICMP outbound
  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

# Droplet
resource "digitalocean_droplet" "api" {
  name     = "sigacad-api"
  size     = var.droplet_size
  image    = "ubuntu-22-04-x64"
  region   = var.droplet_region
  vpc_uuid = digitalocean_vpc.main.id
  ssh_keys = [digitalocean_ssh_key.main.fingerprint]

  user_data = templatefile("${path.module}/cloud-init.yaml", {
    domain        = var.domain
    origin_secret = var.origin_secret
    caddyfile     = templatefile("${path.module}/Caddyfile.tpl", {
      domain        = var.domain
      origin_secret = var.origin_secret
    })
  })
}
