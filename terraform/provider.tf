variable "region" {
  type = string
}

terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.region
}

terraform {
  backend "s3" {
    // State bucket
    // bucket name: Will be provided through the cli.
    key = "terraform.tfstate"
  }
}
