resource "aws_cognito_user_pool" "gawshi" {
  name = "Gawshi-UserPool-${local.suffix}"

  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  password_policy {
    minimum_length = 16
    require_lowercase = true
    require_numbers = true
    require_symbols = false
    require_uppercase = true
    temporary_password_validity_days = 7
  }

  username_configuration {
    case_sensitive = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name = "admin_only"
      priority = 1
    }
  }

  # schema {
  #   name = "description"
  #   attribute_data_type = "String"
  #   developer_only_attribute = true
  #   mutable = true
  #   required = false

  #   string_attribute_constraints {
  #     min_length = 0
  #     max_length = 1024
  #   }
  # }
}

resource "aws_cognito_user_group" "admin_users" {
  name = local.cognito_admin_group_name
  user_pool_id = aws_cognito_user_pool.gawshi.id
  description = "Gawshi admin users group"
  precedence = 1
  role_arn = aws_iam_role.cognito_admin_user.arn
}

resource "aws_iam_role" "cognito_admin_user" {
  name = "Gawshi-CognitoAdminGroupRole-${local.suffix}"

  assume_role_policy = jsonencode({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "",
        Effect: "Allow",
        Principal: {
          "Federated": "cognito-identity.amazonaws.com"
        },
        Action: "sts:AssumeRoleWithWebIdentity",
        Condition: {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": aws_cognito_identity_pool.gawshi.id,
            "cognito-identity.amazonaws.com:sub": [ aws_cognito_user.root.sub ],
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated"
          },
        },
      },
    ],
  })
}

resource "aws_iam_role_policy" "cognito_admin_user" {
  name = "Gawshi-CognitoAdminUserPolicy-${local.suffix}"
  role = aws_iam_role.cognito_admin_user.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:*",
          "appsync:GraphQL",
        ],
        Effect = "Allow",
        Resource = [
          aws_s3_bucket.gawshi_music.arn,
          "${aws_s3_bucket.gawshi_music.arn}/*",
          aws_appsync_graphql_api.gawshi.arn,
        ]
      }
    ]
  })
}

resource "aws_cognito_user_group" "read_only_users" {
  name = "Gawshi-ReadOnly"
  user_pool_id = aws_cognito_user_pool.gawshi.id
  description = "Gawshi read-only users group"
  precedence = 11
  role_arn = aws_iam_role.cognito_read_only_user.arn
}

resource "aws_cognito_user_pool_client" "gawshi" {
  name = "Gawshi-Client-${local.suffix}"
  user_pool_id = aws_cognito_user_pool.gawshi.id
  generate_secret = false
  enable_token_revocation = false
  supported_identity_providers = ["COGNITO"]
  explicit_auth_flows = [
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ]
}

resource "aws_cognito_identity_pool" "gawshi" {
  identity_pool_name = "Gawshi-IdentityPool-${local.suffix}"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id = aws_cognito_user_pool_client.gawshi.id
    provider_name = aws_cognito_user_pool.gawshi.endpoint
    server_side_token_check = false
  }
}

resource "aws_iam_role" "cognito_read_only_user" {
  name = "Gawshi-CognitoReadOnlyUser-${local.suffix}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        },
        Action = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.gawshi.id
          },
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "cognito_read_only_user" {
  name = "Gawshi-CognitoReadOnlyUserPolicy-${local.suffix}"
  role = aws_iam_role.cognito_read_only_user.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "appsync:GraphQL",
        ],
        Effect = "Allow",
        Resource = [
          aws_s3_bucket.gawshi_music.arn,
          "${aws_s3_bucket.gawshi_music.arn}/*",
          aws_appsync_graphql_api.gawshi.arn,
        ]
      }
    ]
  })
}

resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.gawshi.id

  roles = {
    "authenticated" = aws_iam_role.cognito_read_only_user.arn
  }
}

resource "random_password" "root_user_password" {
  length = 32
  lower = true
  special = false
  upper = true
  min_lower = 1
  min_numeric = 1
  min_upper = 1
}

# While this suffix looks unnecessary because we won't have more than 1 root
# user, it provides an extra layer of security. Without it an attacker would
# know the root user's username.
resource "random_string" "root_user_suffix" {
  length = 6
  special = false
}

resource "aws_cognito_user" "root" {
  user_pool_id = aws_cognito_user_pool.gawshi.id
  username = "Gawshi-RootUser-${random_string.root_user_suffix.result}"
  password = random_password.root_user_password.result
}

resource "aws_cognito_user_in_group" "root" {
  user_pool_id = aws_cognito_user_pool.gawshi.id
  group_name = aws_cognito_user_group.admin_users.name
  username = aws_cognito_user.root.username
}

resource "aws_ssm_parameter" "root_username" {
  name = "Gawshi-RootUser-Username-${local.suffix}"
  type = "String"
  value = aws_cognito_user.root.username
  overwrite = true
}

resource "aws_ssm_parameter" "root_password" {
  name = "Gawshi-RootUser-Password-${local.suffix}"
  type = "SecureString"
  value = aws_cognito_user.root.password
  overwrite = true
}

output "cognito" {
  value = {
    root_user = aws_cognito_user.root.username
    endpoint = "https://${aws_cognito_user_pool.gawshi.endpoint}"
    client_id = aws_cognito_user_pool_client.gawshi.id
  }
}
