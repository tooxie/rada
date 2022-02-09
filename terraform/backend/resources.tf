variable "region" {}
provider "aws" {
  region = var.region
}

data "aws_caller_identity" "gawshi" {}

resource "aws_iam_user" "gawshi" {
  name = "gawshi-${random_string.suffix.result}"

  tags = {
    Gawshi = "1"
  }
}

// --- S3
resource "random_string" "suffix" {
  length = 6
  special = false
  upper = false
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "gawshi-terraform-state-${random_string.suffix.result}"
  acl = "private"

  tags = {
    Name = "gawshi-terraform-state"
    Gawshi = "1"
  }
}

resource "aws_iam_policy" "terraform_state" {
  name = "GawshiTerraformState-${random_string.suffix.result}"
  path = "/"
  description = "Policy for the gawshi user to store terraform state in S3"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:Get*",
          "s3:List*",
          "s3:PutObject*",
        ]
        Effect = "Allow"
        Resource = [
          "${aws_s3_bucket.terraform_state.arn}",
          "${aws_s3_bucket.terraform_state.arn}/*",
        ]
      },
    ]
  })

  tags = {
    Gawshi = "1"
  }
}

resource "aws_iam_user_policy_attachment" "gawshi_terraform_state" {
  user = aws_iam_user.gawshi.name
  policy_arn = aws_iam_policy.terraform_state.arn
}

// --- Gawshi resources
resource "aws_iam_policy" "gawshi" {
  name = "gawshi-${random_string.suffix.result}"
  path = "/"
  description = "Policy for the gawshi user that restricts access to the gawshi resources exclusively"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:*",
        ]
        Effect = "Allow"
        Resource = "arn:aws:dynamodb:${var.region}:${data.aws_caller_identity.gawshi.account_id}:table/Gawshi*"
      },
      {
        Action = [
          "iam:*",
        ]
        Effect = "Allow"
        Resource = "arn:aws:iam::${data.aws_caller_identity.gawshi.account_id}:role/Gawshi*"
      },
      {
        Action = [
          "iam:ListPolicies",
        ]
        Effect = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "iam:GetPolicy",
          "iam:GetPolicyVersion",
        ]
        Effect = "Allow"
        Resource = "arn:aws:iam::aws:policy/service-role/AWSAppSyncPushToCloudWatchLogs"
      },
      {
        Effect = "Allow",
        Action = [
            "iam:PassRole",
        ],
        Resource = "*",
        Condition = {
          StringEquals = {
            "iam:PassedToService" = [
              "appsync.amazonaws.com"
            ]
          }
        }
      },
    ]
  })

  tags = {
    Gawshi = "1"
  }
}

resource "aws_iam_user_policy_attachment" "gawshi" {
  user = aws_iam_user.gawshi.name
  policy_arn = aws_iam_policy.gawshi.arn
}

data "aws_iam_policy" "appsync_administrator" {
  arn = "arn:aws:iam::aws:policy/AWSAppSyncAdministrator"
}

resource "aws_iam_user_policy_attachment" "gawshi_appsync_administrator" {
  user = aws_iam_user.gawshi.name
  policy_arn = data.aws_iam_policy.appsync_administrator.arn
}

resource "aws_iam_role" "gawshi" {
  name = "gawshi-${random_string.suffix.result}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid = ""
        Principal = {
          Service = "appsync.amazonaws.com"
        }
      },
    ]
  })

  tags = {
    Gawshi = "1"
  }
}

// --- Outputs
output "gawshi_user_arn" {
  value = aws_iam_user.gawshi.arn
}

output "terraform_state_bucket" {
  value = aws_s3_bucket.terraform_state.bucket
}

output "gawshi_account_id" {
  value = data.aws_caller_identity.gawshi.id
}
