resource "aws_appsync_graphql_api" "gawshi" {
  authentication_type = "API_KEY"
  name = "Gawshi"
  schema = file("./schema.gql")

  log_config {
    cloudwatch_logs_role_arn = aws_iam_role.appsync.arn
    field_log_level = "ALL"
  }

  tags = {
    Gawshi = "1"
  }
}

resource "null_resource" "codegen" {
  triggers = {
    appsync_id = aws_appsync_graphql_api.gawshi.schema
  }

  provisioner "local-exec" {
    command = "./../client/scripts/codegen.sh"
  }
}

resource "aws_appsync_api_key" "gawshi" {
  api_id = aws_appsync_graphql_api.gawshi.id
}

resource "null_resource" "config_amplify" {
  triggers = {
    appsync_id = aws_appsync_graphql_api.gawshi.id
  }

  provisioner "local-exec" {
    command = "./../client/scripts/amplify.sh ${aws_appsync_graphql_api.gawshi.id}"
  }
}

// --- Album
resource "aws_appsync_datasource" "gawshi_albums" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "GawshiAlbums"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.albums.name
  }
}

resource "aws_appsync_resolver" "get_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "getAlbum"
  data_source = aws_appsync_datasource.gawshi_albums.name

  request_template = file("./resolvers/request/getitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "list_albums" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "listAlbums"
  data_source = aws_appsync_datasource.gawshi_albums.name

  request_template = file("./resolvers/request/scan.tpl")
  response_template = file("./resolvers/response/page.tpl")
}

resource "aws_appsync_resolver" "create_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "createAlbum"
  data_source = aws_appsync_datasource.gawshi_albums.name

  request_template = file("./resolvers/request/putitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "update_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "updateAlbum"
  data_source = aws_appsync_datasource.gawshi_albums.name

  request_template = file("./resolvers/request/updateitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "delete_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "deleteAlbum"
  data_source = aws_appsync_datasource.gawshi_albums.name

  request_template = file("./resolvers/request/deleteitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

// --- Artist
resource "aws_appsync_datasource" "gawshi_artists" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "GawshiArtists"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.artists.name
  }
}

resource "aws_appsync_resolver" "get_artist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "getArtist"
  data_source = aws_appsync_datasource.gawshi_artists.name

  request_template = file("./resolvers/request/getitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "list_artists" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "listArtists"
  data_source = aws_appsync_datasource.gawshi_artists.name

  request_template = file("./resolvers/request/scan.tpl")
  response_template = file("./resolvers/response/page.tpl")
}

resource "aws_appsync_resolver" "create_artist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "createArtist"
  data_source = aws_appsync_datasource.gawshi_artists.name

  request_template = file("./resolvers/request/putitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "update_artist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "updateArtist"
  data_source = aws_appsync_datasource.gawshi_artists.name

  request_template = file("./resolvers/request/updateitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "delete_artist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "deleteArtist"
  data_source = aws_appsync_datasource.gawshi_artists.name

  request_template = file("./resolvers/request/deleteitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

// --- Playlist
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

  request_template = file("./resolvers/request/getitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "list_playlists" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "listPlaylists"
  data_source = aws_appsync_datasource.gawshi_playlists.name

  request_template = file("./resolvers/request/scan.tpl")
  response_template = file("./resolvers/response/page.tpl")
}

resource "aws_appsync_resolver" "create_playlist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "createPlaylist"
  data_source = aws_appsync_datasource.gawshi_playlists.name

  request_template = file("./resolvers/request/putitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "update_playlist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "updatePlaylist"
  data_source = aws_appsync_datasource.gawshi_playlists.name

  request_template = file("./resolvers/request/updateitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "delete_playlist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "deletePlaylist"
  data_source = aws_appsync_datasource.gawshi_playlists.name

  request_template = file("./resolvers/request/deleteitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

// --- Tracks
resource "aws_appsync_datasource" "gawshi_tracks" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "GawshiTracks"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.tracks.name
  }
}

resource "aws_appsync_resolver" "get_track" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "getTrack"
  data_source = aws_appsync_datasource.gawshi_tracks.name

  request_template = file("./resolvers/request/getitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "list_tracks" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "listTracks"
  data_source = aws_appsync_datasource.gawshi_tracks.name

  request_template = file("./resolvers/request/scan.tpl")
  response_template = file("./resolvers/response/page.tpl")
}

resource "aws_appsync_resolver" "create_track" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "createTrack"
  data_source = aws_appsync_datasource.gawshi_tracks.name

  request_template = file("./resolvers/request/putitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "update_track" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "updateTrack"
  data_source = aws_appsync_datasource.gawshi_tracks.name

  request_template = file("./resolvers/request/updateitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "delete_track" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "deleteTrack"
  data_source = aws_appsync_datasource.gawshi_tracks.name

  request_template = file("./resolvers/request/deleteitem.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

// --- Outputs
output "graphql_api_uris" {
  value = aws_appsync_graphql_api.gawshi.uris
}

output "graphql_api_key" {
  value = aws_appsync_api_key.gawshi.key
  sensitive = true
}

output "graphql_api_id" {
  value = aws_appsync_graphql_api.gawshi.id
}
