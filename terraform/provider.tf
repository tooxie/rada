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
