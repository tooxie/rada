resource "aws_appsync_graphql_api" "gawshi" {
  authentication_type = "API_KEY"
  name = "Gawshi_${local.suffix}"
  schema = file("./schema.graphql")

  log_config {
    cloudwatch_logs_role_arn = aws_iam_role.appsync.arn
    field_log_level = "ALL"
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
    command = "./../client/scripts/codegen.sh"
  }

  depends_on = [
    null_resource.codegen_config
  ]
}

resource "aws_appsync_api_key" "gawshi" {
  api_id = aws_appsync_graphql_api.gawshi.id
}

resource "null_resource" "codegen_config" {
  triggers = {
    appsync_id = aws_appsync_graphql_api.gawshi.id
  }

  provisioner "local-exec" {
    when = destroy
    command = "./../client/scripts/destroy.sh"
  }

  provisioner "local-exec" {
    command = join(" ", [
      "./../client/scripts/config.sh",
      "--api-id", aws_appsync_graphql_api.gawshi.id,
      "--region", var.region,
      "--api-key", aws_appsync_api_key.gawshi.key,
      "--api-url", lookup(aws_appsync_graphql_api.gawshi.uris, "GRAPHQL"),
      "--auth-mode", aws_appsync_graphql_api.gawshi.authentication_type,
    ])
  }

  depends_on = [
    aws_appsync_graphql_api.gawshi,
    aws_appsync_api_key.gawshi,
  ]
}

// --- Album
resource "aws_appsync_datasource" "gawshi_albums" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "GawshiAlbums"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.artists_albums.name
  }

  depends_on = [ aws_dynamodb_table.artists_albums ]
}

resource "aws_appsync_resolver" "get_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "getAlbum"
  data_source = aws_appsync_datasource.gawshi_albums.name

  request_template = file("./resolvers/request/getadjacent.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "list_albums" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "listAlbums"
  data_source = aws_appsync_datasource.gawshi_albums.name

  request_template = templatefile("./resolvers/request/scanadjacent.tpl", {
    entity: "album"
  })
  response_template = file("./resolvers/response/page.tpl")
}

resource "aws_appsync_function" "put_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  data_source = aws_appsync_datasource.gawshi_albums.name
  name = "createAlbum"

  request_mapping_template = templatefile("./resolvers/request/putalbum.tpl", {
    table_name: aws_dynamodb_table.artists_albums.name,
    entity: "album",
  })
  response_mapping_template = templatefile("./resolvers/response/putalbum.tpl", {
    table_name: aws_dynamodb_table.artists_albums.name
  })
}

resource "aws_appsync_function" "populate_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  data_source = aws_appsync_datasource.gawshi_albums.name
  name = "populateAlbum"

  request_mapping_template = file("./resolvers/request/populatealbum.tpl")
  response_mapping_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "create_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "createAlbum"
  kind = "PIPELINE"

  request_template  = file("./resolvers/request/createalbum.pipe.tpl")
  response_template = file("./resolvers/response/createalbum.pipe.tpl")

  pipeline_config {
    functions = [
      aws_appsync_function.put_album.function_id,
      aws_appsync_function.populate_album.function_id,
    ]
  }
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

resource "aws_appsync_function" "get_albums_for_artist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  data_source = aws_appsync_datasource.gawshi_albums.name
  name = "getAlbumsForArtist"

  request_mapping_template = templatefile("./resolvers/request/connection.tpl", {
    entity: "album",
  })
  response_mapping_template = file("./resolvers/response/connection.tpl")
}

resource "aws_appsync_function" "batch_get_albums" {
  api_id = aws_appsync_graphql_api.gawshi.id
  data_source = aws_appsync_datasource.gawshi_albums.name
  name = "batchGetAlbums"

  request_mapping_template = templatefile("./resolvers/request/batchgetitem.tpl", {
    table_name: aws_dynamodb_table.artists_albums.name
  })
  response_mapping_template = templatefile("./resolvers/response/batchgetitem.tpl", {
    table_name: aws_dynamodb_table.artists_albums.name
  })
}

resource "aws_appsync_resolver" "album_connection" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Artist"
  field = "albums"
  kind = "PIPELINE"

  request_template = templatefile("./resolvers/request/connection.tpl", {
    entity: "album",
  })
  response_template = file("./resolvers/response/albumconnection.tpl")

  pipeline_config {
    functions = [
      aws_appsync_function.get_albums_for_artist.function_id,
      aws_appsync_function.batch_get_albums.function_id,
    ]
  }
}

// --- Artist
resource "aws_appsync_datasource" "gawshi_artists" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "GawshiArtists"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.artists_albums.name
  }
}

resource "aws_appsync_resolver" "get_artist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "getArtist"
  data_source = aws_appsync_datasource.gawshi_artists.name

  request_template = file("./resolvers/request/getadjacent.tpl")
  response_template = file("./resolvers/response/getitem.tpl")
}

resource "aws_appsync_resolver" "list_artists" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "listArtists"
  data_source = aws_appsync_datasource.gawshi_artists.name

  request_template = templatefile("./resolvers/request/scanadjacent.tpl", {
    entity: "artist",
  })
  response_template = file("./resolvers/response/page.tpl")
}

resource "aws_appsync_resolver" "create_artist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Mutation"
  field = "createArtist"
  data_source = aws_appsync_datasource.gawshi_artists.name

  request_template = templatefile("./resolvers/request/putadjacent.tpl", {
    entity: "artist"
  })
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

resource "aws_appsync_resolver" "track_connection" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Album"
  field = "tracks"
  data_source = aws_appsync_datasource.gawshi_tracks.name

  request_template = file("./resolvers/request/connection.tpl")
  response_template = file("./resolvers/response/connection.tpl")
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
