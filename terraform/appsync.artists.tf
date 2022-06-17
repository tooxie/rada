resource "aws_appsync_datasource" "gawshi_artists" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "GawshiArtists"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.artists_albums.name
  }
}

resource "aws_appsync_resolver" "list_artists" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "listArtists"
  data_source = aws_appsync_datasource.gawshi_artists.name

  request_template = templatefile("./resolvers/request/listbyentity.vm", {
    entity: "artist",
    server_id: random_uuid.server_id.result,
  })
  response_template = file("./resolvers/response/page.vm")
}
