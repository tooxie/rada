data "aws_caller_identity" "gawshi" {}

variable "region" {
  type = string
}

variable "suffix" {
  type = string
  default = ""
}

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
  mime_types = jsondecode(file("${path.module}/mime.json"))
}
