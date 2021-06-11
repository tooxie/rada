resource "aws_appsync_datasource" "gawshi_playlists" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "GawshiPlaylists"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.playlists.name
  }
}

resource "aws_appsync_resolver" "get_playlist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "getPlaylist"
  data_source = aws_appsync_datasource.gawshi_playlists.name

  request_template = file("./resolvers/request/getitem.vm")
  response_template = file("./resolvers/response/getitem.vm")
}

resource "aws_appsync_resolver" "list_playlists" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "listPlaylists"
  data_source = aws_appsync_datasource.gawshi_playlists.name

  request_template = file("./resolvers/request/scan.vm")
  response_template = file("./resolvers/response/page.vm")
}
