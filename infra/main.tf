terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "sa-east-1"
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

provider "digitalocean" {
  token = var.do_token
}

resource "random_id" "suffix" {
  byte_length = 4
}
