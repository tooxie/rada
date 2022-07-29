resource "aws_api_gateway_rest_api" "gawshi" {
  name = "Gawshi-${local.suffix}"

  tags = {
    Gawshi = "1"
  }

  depends_on = [
    aws_api_gateway_account.gawshi
  ]
}

resource "aws_api_gateway_account" "gawshi" {
  cloudwatch_role_arn = aws_iam_role.cloudwatch.arn
}

resource "aws_api_gateway_deployment" "gawshi" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.gawshi.body))
    get_secret_hash = data.archive_file.secret.output_base64sha256
    claim_invite_hash = data.archive_file.invite.output_base64sha256
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_method.claim_invite,
    aws_api_gateway_method.get_secret,
  ]
}

resource "random_string" "stage_name" {
  length = 6
  special = false
  upper = false
}

resource "aws_api_gateway_stage" "gawshi" {
  deployment_id = aws_api_gateway_deployment.gawshi.id
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  stage_name = random_string.stage_name.result

  tags = {
    Gawshi = "1"
  }

  depends_on = [
    aws_api_gateway_account.gawshi
  ]
}

resource "aws_api_gateway_method_settings" "gawshi" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  stage_name = aws_api_gateway_stage.gawshi.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled = true
    data_trace_enabled = true
    logging_level = "INFO"
  }
}

// --- /invite
resource "aws_api_gateway_resource" "invite" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  parent_id = aws_api_gateway_rest_api.gawshi.root_resource_id
  path_part = "invite"
}

resource "aws_api_gateway_resource" "claim_invite" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  parent_id = aws_api_gateway_resource.invite.id
  path_part = "{params+}"
}

resource "aws_api_gateway_method" "claim_invite" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  resource_id = aws_api_gateway_resource.claim_invite.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "claim_invite" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  resource_id = aws_api_gateway_resource.claim_invite.id
  http_method = aws_api_gateway_method.claim_invite.http_method
  status_code = "200"

  response_models = {
      "application/json" = "Empty"
  }

  response_parameters = {
      "method.response.header.Access-Control-Allow-Headers" = true,
      "method.response.header.Access-Control-Allow-Methods" = true,
      "method.response.header.Access-Control-Allow-Origin" = true
  }
  depends_on = [aws_api_gateway_method.claim_invite]
}

resource "aws_api_gateway_integration" "claim_invite" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  resource_id = aws_api_gateway_resource.claim_invite.id
  http_method = aws_api_gateway_method.claim_invite.http_method
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = aws_lambda_function.claim_invite.invoke_arn
}

resource "aws_api_gateway_integration_response" "claim_invite" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  resource_id = aws_api_gateway_resource.claim_invite.id
  http_method = aws_api_gateway_method.claim_invite.http_method
  status_code = aws_api_gateway_method_response.claim_invite.status_code

  depends_on = [
    aws_api_gateway_integration.claim_invite,
    aws_api_gateway_method_response.claim_invite
  ]
}

// --- /secret
resource "aws_api_gateway_resource" "secret" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  parent_id = aws_api_gateway_rest_api.gawshi.root_resource_id
  path_part = "secret"
}

resource "aws_api_gateway_resource" "get_secret" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  parent_id = aws_api_gateway_resource.secret.id
  path_part = "{params+}"
}

resource "aws_api_gateway_method" "get_secret" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  resource_id = aws_api_gateway_resource.get_secret.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "get_secret" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  resource_id = aws_api_gateway_resource.get_secret.id
  http_method = aws_api_gateway_method.get_secret.http_method
  status_code = "200"

  response_models = {
      "application/json" = "Empty"
  }

  response_parameters = {
      "method.response.header.Access-Control-Allow-Headers" = true,
      "method.response.header.Access-Control-Allow-Methods" = true,
      "method.response.header.Access-Control-Allow-Origin" = true
  }
  depends_on = [
    aws_api_gateway_method.get_secret,
    aws_api_gateway_integration.get_secret,
  ]
}

resource "aws_api_gateway_integration" "get_secret" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  resource_id = aws_api_gateway_resource.get_secret.id
  http_method = aws_api_gateway_method.get_secret.http_method
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = aws_lambda_function.get_secret.invoke_arn
}

resource "aws_api_gateway_integration_response" "get_secret" {
  rest_api_id = aws_api_gateway_rest_api.gawshi.id
  resource_id = aws_api_gateway_resource.get_secret.id
  http_method = aws_api_gateway_method.get_secret.http_method
  status_code = aws_api_gateway_method_response.get_secret.status_code

  depends_on = [aws_api_gateway_method_response.get_secret]
}

// --- Outputs
output "api_endpoint" {
  value = aws_api_gateway_stage.gawshi.invoke_url
}

output "api_resources" {
  value = {
    claim_invite: "${aws_api_gateway_stage.gawshi.invoke_url}${aws_api_gateway_resource.claim_invite.path}",
    get_secret: "${aws_api_gateway_stage.gawshi.invoke_url}${aws_api_gateway_resource.get_secret.path}",
  }
}
