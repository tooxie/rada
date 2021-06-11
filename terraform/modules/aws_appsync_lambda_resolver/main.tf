resource "aws_appsync_resolver" "resolver" {
  api_id = var.appsync_graphql_api_id
  type = var.type
  field = var.field
  data_source = aws_appsync_datasource.resolver.name
  response_template = <<EOT
#if ($util.isNull($ctx.result.error))
  $ctx.result
#else
  $util.error($ctx.result.error.message, $ctx.result.error.type)
#end
EOT
}

data "archive_file" "resolver" {
  type = "zip"
  source_file = var.source_file
  output_file_mode = "0666"
  output_path = var.output_path
}

resource "aws_lambda_function" "resolver" {
  filename = data.archive_file.resolver.output_path
  function_name = var.function_name
  role = var.lambda_role_arn
  handler = var.lambda_handler
  source_code_hash = data.archive_file.resolver.output_base64sha256
  runtime = "python3.8"

  environment {
    variables = var.environment
  }

  tags = {
    Gawshi = "1"
  }
}

resource "aws_lambda_permission" "resolver" {
  function_name = aws_lambda_function.resolver.function_name
  statement_id = "AllowExecutionFromAppSync"
  action = "lambda:InvokeFunction"
  principal = "appsync.amazonaws.com"
  source_arn = "${var.appsync_graphql_api_arn}/*/*/*"
}

resource "aws_appsync_datasource" "resolver" {
  api_id = var.appsync_graphql_api_id
  name = replace(var.function_name, "-", "_")
  service_role_arn = var.datasource_service_role_arn
  type = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.resolver.arn
  }
}
