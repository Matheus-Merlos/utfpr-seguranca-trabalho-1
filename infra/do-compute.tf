# VPC
resource "digitalocean_vpc" "main" {
  name     = "sigacad-vpc-01"
  region   = var.droplet_region
  ip_range = "10.1.10.0/24"
}

# Firewall
resource "digitalocean_firewall" "main" {
  name = "sigacad-firewall"

  droplet_ids = [digitalocean_droplet.api.id]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTP from anywhere
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS from anywhere
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

resource "tls_private_key" "sigacad_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "digitalocean_ssh_key" "sigacad_ssh_key" {
  name       = "SIGAcad instance key"
  public_key = tls_private_key.sigacad_key.public_key_openssh
}

# Droplet
resource "digitalocean_droplet" "api" {
  name     = "sigacad-app"
  size     = var.droplet_size
  image    = "ubuntu-22-04-x64"
  region   = var.droplet_region
  vpc_uuid = digitalocean_vpc.main.id
  ssh_keys = [digitalocean_ssh_key.sigacad_ssh_key.id]

  user_data = templatefile("${path.module}/cloud-init.yaml", {
    domain = var.domain
    caddyfile = templatefile("${path.module}/Caddyfile.tpl", {
      domain = var.domain
    })
  })
}
