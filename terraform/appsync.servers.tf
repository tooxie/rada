resource "aws_appsync_datasource" "servers" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "GawshiServers"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.servers.name
  }
}

resource "aws_appsync_resolver" "list_servers" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "listServers"
  data_source = aws_appsync_datasource.servers.name

  request_template = <<VTL
{
  "version": "2017-02-28",
  "operation": "Scan"
}
VTL

  response_template = <<VTL
{
  "items": $util.toJson($context.result.items),
  "nextToken": $util.toJson($util.defaultIfNullOrBlank($context.result.nextToken, null))
}
VTL
}
