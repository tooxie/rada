data "aws_caller_identity" "gawshi" {}

terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 4.8.0"
    }
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      ServerName = var.server_name
    }
  }
}

terraform {
  backend "s3" {
    // State bucket
    // bucket name: Will be provided through the cli.
    key = "terraform.tfstate"
  }
}

resource "random_uuid" "server_id" { }
resource "random_string" "suffix" {
  length = 6
  special = false
  upper = false
}

locals {
  suffix = var.suffix != "" ? var.suffix : random_string.suffix.result
  mime_types = jsondecode(file("${path.module}/mime.json"))
  app_public_url_parameter_name = "GawshiAppPublicUrl-${local.suffix}"
  cognito_admin_group_name = "Gawshi-Admin-${local.suffix}"
  server_id = "server:${random_uuid.server_id.result}"
}

output "server_id" {
  value = local.server_id
}
