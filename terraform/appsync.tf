resource "aws_appsync_graphql_api" "gawshi" {
  authentication_type = "AMAZON_COGNITO_USER_POOLS"
  name = "Gawshi-${local.suffix}"
  schema = templatefile("./schema.graphql", {
    COGNITO_ADMIN_GROUP_NAME: aws_cognito_user_group.admin_users.name
  })

  log_config {
    cloudwatch_logs_role_arn = aws_iam_role.appsync.arn
    field_log_level = "ERROR"
  }

  user_pool_config {
    aws_region = var.region
    default_action = "ALLOW"
    user_pool_id = aws_cognito_user_pool.gawshi.id
  }

  tags = {
    Gawshi = "1"
  }
}

resource "null_resource" "codegen_exec" {
  triggers = {
    graphql_schema_md5 = filemd5("./schema.graphql")
  }

  provisioner "local-exec" {
    command = join(" ", [
      "cd ../client;",
      "npm run codegen",
    ])
  }

  depends_on = [
    null_resource.codegen_config,
    aws_appsync_graphql_api.gawshi,
  ]
}

resource "null_resource" "codegen_config" {
  triggers = {
    appsync_id = aws_appsync_graphql_api.gawshi.id
    appsync_url = lookup(aws_appsync_graphql_api.gawshi.uris, "GRAPHQL")
    s3_bucket_url = aws_s3_bucket.gawshi_music.bucket_domain_name
    server_id = random_uuid.server_id.result
  }

  provisioner "local-exec" {
    when = destroy
    command = join(" ", [
      "cd ../client;",
      "npm run codegen:destroy",
    ])
  }

  provisioner "local-exec" {
    command = join(" ", [
      "cd ../client;",
      "npm run codegen:config --",
      "--api-id", aws_appsync_graphql_api.gawshi.id,
      "--api-url", lookup(aws_appsync_graphql_api.gawshi.uris, "GRAPHQL"),
      "--region", var.region,
      "--server-id", random_uuid.server_id.result,
    ])
  }
}

// --- Outputs
output "graphql_api_uris" {
  value = aws_appsync_graphql_api.gawshi.uris
}
