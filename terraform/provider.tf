variable "region" {
  type = string
}

variable "suffix" {
  type = string
  default = ""
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

resource "random_string" "suffix" {
  length = 6
  special = false
  upper = false
}

locals {
  suffix = var.suffix != "" ? var.suffix : random_string.suffix.result
}
