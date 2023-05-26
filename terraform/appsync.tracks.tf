resource "aws_appsync_datasource" "gawshi_tracks" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "GawshiTracks"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.tracks.name
  }
}

resource "aws_appsync_resolver" "list_orphan_tracks" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "listOrphanTracks"
  data_source = aws_appsync_datasource.gawshi_tracks.name

  request_template = file("./resolvers/request/listorphantracks.vm")
  response_template = file("./resolvers/response/page.vm")
}

resource "aws_appsync_resolver" "create_track" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "createTrack"
  data_source = aws_appsync_datasource.gawshi_tracks.name

  request_template = templatefile("./resolvers/request/puttrack.vm", {
    server_id: local.server_id,
  })
  response_template = file("./resolvers/response/getitem.vm")
}

resource "aws_appsync_resolver" "album_tracks_connection" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Album"
  field = "tracks"
  data_source = aws_appsync_datasource.gawshi_tracks.name

  request_template = file("./resolvers/request/trackconnection.vm")
  response_template = file("./resolvers/response/trackconnection.vm")
}

resource "aws_appsync_resolver" "update_track" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "updateTrack"
  data_source = aws_appsync_datasource.gawshi_tracks.name

  request_template = templatefile("./resolvers/request/updatetrack.vm", {
    server_id: local.server_id,
  })
  response_template = file("./resolvers/response/connection.vm")
}
