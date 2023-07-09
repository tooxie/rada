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

  lifecycle {
    ignore_changes = [
      additional_authentication_provider,
    ]
  }
}

// --- Outputs
output "graphql" {
  value = {
    endpoint = lookup(aws_appsync_graphql_api.gawshi.uris, "GRAPHQL"),
    realtime = lookup(aws_appsync_graphql_api.gawshi.uris, "REALTIME"),
  }
}
