data "aws_caller_identity" "gawshi" {}

variable "website_root" {
  type = string
  default = "../client/build"
}

variable "force_destroy_bucket" {
  type = bool
  default = false
}

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
