provider "aws" {}

resource "random_string" "suffix" {
  length = 6
  special = false
}

resource "aws_s3_bucket" "state" {
  bucket = "gawshi-terraform-state-${random_string.suffix.result}"
  acl = "private"

  tags = {
    Name = "gawshi-terraform-state"
    Gawshi = "1"
  }
}

resource "aws_dynamodb_table" "lock" {
  name = "gawshi-terraform-lock"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "LockID"

  attribute {
    Name = "LockID"
    type = "S"
  }
}

resource "aws_iam_user" "gawshi" {
  name = "gawshi"

  tags = {
    Gawshi = "1"
  }
}

resource "aws_iam_access_key" "gawshi" {
  user = aws_iam_user.gawshi.name
}
