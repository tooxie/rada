resource "aws_appsync_datasource" "gawshi_albums" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "GawshiAlbums"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.artists_albums.name
  }
}

resource "aws_appsync_resolver" "list_albums" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "listAlbums"
  data_source = aws_appsync_datasource.gawshi_albums.name

  request_template = templatefile("./resolvers/request/listbyentity.vm", {
    entity: "album",
    server_id: random_uuid.server_id.result,
  })
  response_template = file("./resolvers/response/page.vm")
}

resource "aws_appsync_function" "get_albums_for_artist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  data_source = aws_appsync_datasource.gawshi_albums.name
  name = "getAlbumsForArtist"

  request_mapping_template = file("./resolvers/request/albumconnection.vm")
  response_mapping_template = file("./resolvers/response/connection.vm")
}

resource "aws_appsync_function" "batch_get_albums" {
  api_id = aws_appsync_graphql_api.gawshi.id
  data_source = aws_appsync_datasource.gawshi_albums.name
  name = "batchGetAlbums"

  request_mapping_template = templatefile("./resolvers/request/batchgetitem.vm", {
    entity: "album",
    table_name: aws_dynamodb_table.artists_albums.name
  })
  response_mapping_template = templatefile("./resolvers/response/batchgetitem.vm", {
    table_name: aws_dynamodb_table.artists_albums.name
  })
}

resource "aws_appsync_resolver" "album_connection" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Artist"
  field = "albums"
  kind = "PIPELINE"

  request_template = file("./resolvers/request/albumconnection.vm")
  response_template = file("./resolvers/response/albumconnection.vm")

  pipeline_config {
    functions = [
      aws_appsync_function.get_albums_for_artist.function_id,
      aws_appsync_function.batch_get_albums.function_id,
    ]
  }
}
