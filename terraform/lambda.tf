data "archive_file" "invite" {
  type = "zip"
  source_dir = "${path.module}/lambdas/invite/"
  output_file_mode = "0666"
  output_path = "${path.module}/dist/invite.zip"
}

data "archive_file" "get_client_id" {
  type = "zip"
  source_dir = "${path.module}/lambdas/clientid/"
  output_file_mode = "0666"
  output_path = "${path.module}/dist/clientid.zip"
}

resource "aws_iam_role" "invite" {
  name = "Gawshi-LambdaInvite-${local.suffix}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Effect = "Allow"
      },
    ]
  })
}

resource "aws_iam_role_policy" "lambda_invites" {
  name = "Gawshi-LambdaInvitations-${local.suffix}"
  role = aws_iam_role.invite.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "ssm:GetParameter",
        ],
        Effect = "Allow",
        Resource = [
          aws_ssm_parameter.app_public_url.arn,
        ]
      },
      {
        Action = [
          "dynamodb:*",
        ],
        Effect = "Allow",
        Resource = [
          aws_dynamodb_table.invitations.arn,
          "${aws_dynamodb_table.invitations.arn}/*",

          aws_dynamodb_table.server_invitations.arn,
          "${aws_dynamodb_table.server_invitations.arn}/*",
        ]
      },
      {
        Action = [
          "cognito-idp:AdminAddUserToGroup",
          "cognito-idp:AdminConfirmSignUp",
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminGetUser",
          "cognito-idp:AdminSetUserPassword",
          "cognito-idp:CreateUserPoolClient",
          "cognito-idp:DescribeUserPoolClient",
        ],
        Effect = "Allow",
        Resource = [
          aws_cognito_user_pool.gawshi.arn
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "invite_push_to_cw" {
  role = aws_iam_role.invite.name
  policy_arn = data.aws_iam_policy.lambda_logging.arn
}

resource "aws_lambda_function" "claim_invite" {
  filename = data.archive_file.invite.output_path
  function_name = "Gawshi-ClaimInvite-${local.suffix}"
  role = aws_iam_role.invite.arn
  handler = "claim.handler"
  source_code_hash = data.archive_file.invite.output_base64sha256
  runtime = "python3.8"

  environment {
    variables = {
      APP_PUBLIC_URL_PARAMETER_NAME = local.app_public_url_parameter_name
      COGNITO_ADMIN_GROUP_NAME = aws_cognito_user_group.admin_users.name
      COGNITO_USER_POOL_ID = aws_cognito_user_pool.gawshi.id
      INVITATIONS_TABLE_NAME = aws_dynamodb_table.invitations.name
    }
  }
}

resource "aws_lambda_permission" "claim_invite" {
  statement_id = "AllowExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.claim_invite.function_name
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.gawshi.execution_arn}/*/*"
}

resource "aws_lambda_function" "get_client_id" {
  filename = data.archive_file.get_client_id.output_path
  function_name = "Gawshi-GetClientId-${local.suffix}"
  role = aws_iam_role.invite.arn
  handler = "getclientid.handler"
  source_code_hash = data.archive_file.get_client_id.output_base64sha256
  runtime = "python3.8"

  environment {
    variables = {
      COGNITO_USER_POOL_ID = aws_cognito_user_pool.gawshi.id
      SERVER_INVITATIONS_TABLE_NAME = aws_dynamodb_table.server_invitations.name
    }
  }
}

resource "aws_lambda_permission" "get_client_id" {
  statement_id = "AllowExecutionFromApiGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_client_id.function_name
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.gawshi.execution_arn}/*/*"
}
