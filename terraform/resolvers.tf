resource "aws_iam_policy" "appsync_invoke_lambda" {
  name = "GawshiAppSyncInvokeLambda-${local.suffix}"
  path = "/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "lambda:InvokeFunction",
        ]
        Effect = "Allow"
        Resource = "arn:aws:lambda:${var.region}:${data.aws_caller_identity.gawshi.account_id}:function:Gawshi-*-${local.suffix}"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "appsync_invoke_lambda" {
  role = aws_iam_role.appsync.name
  policy_arn = aws_iam_policy.appsync_invoke_lambda.arn
}

// --- createAlbum
resource "aws_appsync_resolver" "create_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  field = "createAlbum"
  type = "Mutation"
  data_source = aws_appsync_datasource.create_album.name
  response_template = <<EOT
#if ($util.isNull($ctx.result.error))
  $ctx.result
#else
  $util.error($ctx.result.error.message, $ctx.result.error.type)
#end
EOT
}

resource "aws_lambda_function" "create_album" {
  filename = data.archive_file.create_album.output_path
  function_name = "Gawshi-AppSyncResolver-CreateAlbum-${local.suffix}"
  role = aws_iam_role.lambda_exec.arn
  handler = "createalbum.handler"
  source_code_hash = data.archive_file.create_album.output_base64sha256
  runtime = "python3.8"

  environment {
    variables = {
      DYNAMODB_ALBUMS_TABLE = aws_dynamodb_table.artists_albums.name
      SERVER_ID = local.server_id
    }
  }
}

data "archive_file" "create_album" {
  type = "zip"
  source_file = "${path.module}/lambdas/resolvers/createalbum.py"
  output_file_mode = "0666"
  output_path = "${path.module}/dist/resolvers/createalbum.zip"
}

resource "aws_lambda_permission" "create_album" {
  function_name = aws_lambda_function.create_album.function_name
  statement_id = "AllowExecutionFromAppSync"
  action = "lambda:InvokeFunction"
  principal = "appsync.amazonaws.com"
  source_arn = "${aws_appsync_graphql_api.gawshi.arn}/*/*/*"
}

resource "aws_appsync_datasource" "create_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "createAlbum"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.create_album.arn
  }
}

// --- createArtist
resource "aws_appsync_resolver" "create_artist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  field = "createArtist"
  type = "Mutation"
  data_source = aws_appsync_datasource.create_artist.name
  response_template = <<EOT
#if ($util.isNull($ctx.result.error))
  $ctx.result
#else
  $util.error($ctx.result.error.message, $ctx.result.error.type)
#end
EOT
}

resource "aws_lambda_function" "create_artist" {
  filename = data.archive_file.create_artist.output_path
  function_name = "Gawshi-AppSyncResolver-CreateArtist-${local.suffix}"
  role = aws_iam_role.lambda_exec.arn
  handler = "createartist.handler"
  source_code_hash = data.archive_file.create_artist.output_base64sha256
  runtime = "python3.8"

  environment {
    variables = {
      DYNAMODB_ARTISTS_TABLE = aws_dynamodb_table.artists_albums.name
      SERVER_ID = local.server_id
    }
  }
}

data "archive_file" "create_artist" {
  type = "zip"
  source_file = "${path.module}/lambdas/resolvers/createartist.py"
  output_file_mode = "0666"
  output_path = "${path.module}/dist/resolvers/createartist.zip"
}

resource "aws_lambda_permission" "create_artist" {
  function_name = aws_lambda_function.create_artist.function_name
  statement_id = "AllowExecutionFromAppSync"
  action = "lambda:InvokeFunction"
  principal = "appsync.amazonaws.com"
  source_arn = "${aws_appsync_graphql_api.gawshi.arn}/*/*/*"
}

resource "aws_appsync_datasource" "create_artist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "createArtist"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.create_artist.arn
  }
}

// --- getArtist
resource "aws_appsync_resolver" "get_artist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "getArtist"
  data_source = aws_appsync_datasource.get_artist.name
  response_template = <<EOT
#if ($util.isNull($ctx.result.error))
  $ctx.result
#else
  $util.error($ctx.result.error.message, $ctx.result.error.type)
#end
EOT
}

resource "aws_lambda_function" "get_artist" {
  filename = data.archive_file.get_artist.output_path
  function_name = "Gawshi-AppSyncResolver-GetArtist-${local.suffix}"
  role = aws_iam_role.lambda_exec.arn
  handler = "getartist.handler"
  source_code_hash = data.archive_file.get_artist.output_base64sha256
  runtime = "python3.8"

  environment {
    variables = {
      DYNAMODB_ARTISTS_TABLE = aws_dynamodb_table.artists_albums.name
    }
  }
}

data "archive_file" "get_artist" {
  type = "zip"
  source_file = "${path.module}/lambdas/resolvers/getartist.py"
  output_file_mode = "0666"
  output_path = "${path.module}/dist/resolvers/getartist.zip"
}

resource "aws_lambda_permission" "get_artist" {
  function_name = aws_lambda_function.get_artist.function_name
  statement_id = "AllowExecutionFromAppSync"
  action = "lambda:InvokeFunction"
  principal = "appsync.amazonaws.com"
  source_arn = "${aws_appsync_graphql_api.gawshi.arn}/*/*/*"
}

resource "aws_appsync_datasource" "get_artist" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "getArtist"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.get_artist.arn
  }
}

// --- getAlbum
resource "aws_appsync_resolver" "get_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "getAlbum"
  data_source = aws_appsync_datasource.get_album.name
  response_template = <<EOT
#if ($util.isNull($ctx.result.error))
  $ctx.result
#else
  $util.error($ctx.result.error.message, $ctx.result.error.type)
#end
EOT
}

resource "aws_lambda_function" "get_album" {
  filename = data.archive_file.get_album.output_path
  function_name = "Gawshi-AppSyncResolver-GetAlbum-${local.suffix}"
  role = aws_iam_role.lambda_exec.arn
  handler = "getalbum.handler"
  source_code_hash = data.archive_file.get_album.output_base64sha256
  runtime = "python3.8"

  environment {
    variables = {
      DYNAMODB_ALBUMS_TABLE = aws_dynamodb_table.artists_albums.name
    }
  }
}

data "archive_file" "get_album" {
  type = "zip"
  source_file = "${path.module}/lambdas/resolvers/getalbum.py"
  output_file_mode = "0666"
  output_path = "${path.module}/dist/resolvers/getalbum.zip"
}

resource "aws_lambda_permission" "get_album" {
  function_name = aws_lambda_function.get_album.function_name
  statement_id = "AllowExecutionFromAppSync"
  action = "lambda:InvokeFunction"
  principal = "appsync.amazonaws.com"
  source_arn = "${aws_appsync_graphql_api.gawshi.arn}/*/*/*"
}

resource "aws_appsync_datasource" "get_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "getAlbum"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.get_album.arn
  }
}

// --- Album.artists
resource "aws_appsync_resolver" "get_artists_for_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Album"
  field = "artists"
  data_source = aws_appsync_datasource.get_artists_for_album.name
  response_template = <<EOT
#if ($util.isNull($ctx.result.error))
  $ctx.result
#else
  $util.error($ctx.result.error.message, $ctx.result.error.type)
#end
EOT
}

resource "aws_lambda_function" "get_artists_for_album" {
  filename = data.archive_file.get_artists_for_album.output_path
  function_name = "Gawshi-AppSyncResolver-GetArtistsForAlbum-${local.suffix}"
  role = aws_iam_role.lambda_exec.arn
  handler = "getartistsforalbum.handler"
  source_code_hash = data.archive_file.get_artists_for_album.output_base64sha256
  runtime = "python3.8"

  environment {
    variables = {
      DYNAMODB_ARTISTS_TABLE = aws_dynamodb_table.artists_albums.name
      DYNAMODB_INDEX_NAME = "ById"
    }
  }
}

data "archive_file" "get_artists_for_album" {
  type = "zip"
  source_file = "${path.module}/lambdas/resolvers/getartistsforalbum.py"
  output_file_mode = "0666"
  output_path = "${path.module}/dist/resolvers/getartistsforalbum.zip"
}

resource "aws_lambda_permission" "get_artists_for_album" {
  function_name = aws_lambda_function.get_artists_for_album.function_name
  statement_id = "AllowExecutionFromAppSync"
  action = "lambda:InvokeFunction"
  principal = "appsync.amazonaws.com"
  source_arn = "${aws_appsync_graphql_api.gawshi.arn}/*/*/*"
}

resource "aws_appsync_datasource" "get_artists_for_album" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "getArtistsForAlbum"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.get_artists_for_album.arn
  }
}

// --- getTrack
resource "aws_appsync_resolver" "get_track" {
  api_id = aws_appsync_graphql_api.gawshi.id
  type = "Query"
  field = "getTrack"
  data_source = aws_appsync_datasource.get_track.name
  response_template = <<EOT
#if ($util.isNull($ctx.result.error))
  $ctx.result
#else
  $util.error($ctx.result.error.message, $ctx.result.error.type)
#end
EOT
}

resource "aws_lambda_function" "get_track" {
  filename = data.archive_file.get_track.output_path
  function_name = "Gawshi-AppSyncResolver-GetTrack-${local.suffix}"
  role = aws_iam_role.lambda_exec.arn
  handler = "gettrack.handler"
  source_code_hash = data.archive_file.get_track.output_base64sha256
  runtime = "python3.8"

  environment {
    variables = {
      DYNAMODB_TRACKS_TABLE = aws_dynamodb_table.tracks.name
    }
  }
}

data "archive_file" "get_track" {
  type = "zip"
  source_file = "${path.module}/lambdas/resolvers/gettrack.py"
  output_file_mode = "0666"
  output_path = "${path.module}/dist/resolvers/gettrack.zip"
}

resource "aws_lambda_permission" "get_track" {
  function_name = aws_lambda_function.get_track.function_name
  statement_id = "AllowExecutionFromAppSync"
  action = "lambda:InvokeFunction"
  principal = "appsync.amazonaws.com"
  source_arn = "${aws_appsync_graphql_api.gawshi.arn}/*/*/*"
}

resource "aws_appsync_datasource" "get_track" {
  api_id = aws_appsync_graphql_api.gawshi.id
  name = "getTrack"
  service_role_arn = aws_iam_role.appsync.arn
  type = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.get_track.arn
  }
}

module "get_artists_for_track" {
  source = "./modules/aws_appsync_lambda_resolver"

  type = "Track"
  field = "artists"

  appsync_graphql_api_id = aws_appsync_graphql_api.gawshi.id
  appsync_graphql_api_arn = aws_appsync_graphql_api.gawshi.arn
  datasource_service_role_arn = aws_iam_role.appsync.arn
  lambda_role_arn = aws_iam_role.lambda_exec.arn

  source_file = "${path.module}/lambdas/resolvers/getartistsfortrack.py"
  output_path = "${path.module}/dist/resolvers/getartistsfortrack.zip"
  lambda_handler = "getartistsfortrack.handler"
  function_name = "Gawshi-AppSyncResolver-GetArtistsForTrack-${local.suffix}"

  environment = {
    DYNAMODB_ARTISTS_TABLE = aws_dynamodb_table.artists_albums.name
  }
}

module "get_album_for_track" {
  source = "./modules/aws_appsync_lambda_resolver"

  type = "Track"
  field = "album"

  appsync_graphql_api_id = aws_appsync_graphql_api.gawshi.id
  appsync_graphql_api_arn = aws_appsync_graphql_api.gawshi.arn
  datasource_service_role_arn = aws_iam_role.appsync.arn
  lambda_role_arn = aws_iam_role.lambda_exec.arn

  source_file = "${path.module}/lambdas/resolvers/getalbumfortrack.py"
  output_path = "${path.module}/dist/resolvers/getalbumfortrack.zip"
  lambda_handler = "getalbumfortrack.handler"
  function_name = "Gawshi-AppSyncResolver-GetAlbumForTrack-${local.suffix}"

  environment = {
    DYNAMODB_ALBUMS_TABLE = aws_dynamodb_table.artists_albums.name
  }
}

module "create_invite" {
  source = "./modules/aws_appsync_lambda_resolver"

  type = "Mutation"
  field = "createInvite"

  appsync_graphql_api_id = aws_appsync_graphql_api.gawshi.id
  appsync_graphql_api_arn = aws_appsync_graphql_api.gawshi.arn
  datasource_service_role_arn = aws_iam_role.appsync.arn
  lambda_role_arn = aws_iam_role.lambda_exec.arn

  source_file = "${path.module}/lambdas/resolvers/createinvite.py"
  output_path = "${path.module}/dist/lambdas/resolvers/createinvite.zip"
  lambda_handler = "createinvite.handler"
  function_name = "Gawshi-AppSyncResolver-CreateInvite-${local.suffix}"

  environment = {
    INVITATIONS_TABLE_NAME = aws_dynamodb_table.invitations.name
    PUBLIC_URL = aws_api_gateway_stage.gawshi.invoke_url
  }
}

module "create_server_invite" {
  source = "./modules/aws_appsync_lambda_resolver"

  type = "Mutation"
  field = "createServerInvite"

  appsync_graphql_api_id = aws_appsync_graphql_api.gawshi.id
  appsync_graphql_api_arn = aws_appsync_graphql_api.gawshi.arn
  datasource_service_role_arn = aws_iam_role.appsync.arn
  lambda_role_arn = aws_iam_role.lambda_exec.arn

  source_file = "${path.module}/lambdas/resolvers/createserverinvite.py"
  output_path = "${path.module}/dist/lambdas/resolvers/createserverinvite.zip"
  lambda_handler = "createserverinvite.handler"
  function_name = "Gawshi-AppSyncResolver-CreateServerInvite-${local.suffix}"

  environment = {
    PUBLIC_URL = aws_api_gateway_stage.gawshi.invoke_url
    SERVER_INVITATIONS_TABLE_NAME = aws_dynamodb_table.server_invitations.name
    USER_POOL_ID = aws_cognito_user_pool.gawshi.id
    GET_CLIENT_ID_URL = "${aws_api_gateway_stage.gawshi.invoke_url}/${aws_api_gateway_resource.get_client_id_base_path.path_part}",
  }
}

module "register_server" {
  source = "./modules/aws_appsync_lambda_resolver"

  type = "Mutation"
  field = "registerServer"

  appsync_graphql_api_id = aws_appsync_graphql_api.gawshi.id
  appsync_graphql_api_arn = aws_appsync_graphql_api.gawshi.arn
  datasource_service_role_arn = aws_iam_role.appsync.arn
  lambda_role_arn = aws_iam_role.lambda_exec.arn

  source_file = "${path.module}/lambdas/resolvers/registerserver.py"
  output_path = "${path.module}/dist/lambdas/resolvers/registerserver.zip"
  lambda_handler = "registerserver.handler"
  function_name = "Gawshi-AppSyncResolver-RegisterServer-${local.suffix}"

  // This lambda needs to:
  // * Query the other server to get the client id (which will most likely hit
  //   a cold start).
  // * Persist the new server entry in the DB.
  // * Create cognito's identity provider.
  // * Delete the invite from the DB.
  // Until we split these responsibilities into a couple of lambdas, we have no
  // choice but to set a generous timeout.
  timeout = 10

  environment = {
    COGNITO_IDENTITY_POOL_ID = aws_cognito_identity_pool.gawshi.id
    COGNITO_USER_POOL_ID = aws_cognito_user_pool.gawshi.id
    PUBLIC_URL = aws_api_gateway_stage.gawshi.invoke_url
    SERVER_INVITATIONS_TABLE_NAME = aws_dynamodb_table.server_invitations.name
    SERVERS_TABLE_NAME = aws_dynamodb_table.servers.name
    SERVER_NAME = var.server_name
  }
}

module "delete_server" {
  source = "./modules/aws_appsync_lambda_resolver"

  type = "Mutation"
  field = "deleteServer"

  appsync_graphql_api_id = aws_appsync_graphql_api.gawshi.id
  appsync_graphql_api_arn = aws_appsync_graphql_api.gawshi.arn
  datasource_service_role_arn = aws_iam_role.appsync.arn
  lambda_role_arn = aws_iam_role.lambda_exec.arn

  source_file = "${path.module}/lambdas/resolvers/deleteserver.py"
  output_path = "${path.module}/dist/lambdas/resolvers/deleteserver.zip"
  lambda_handler = "deleteserver.handler"
  function_name = "Gawshi-AppSyncResolver-DeleteServer-${local.suffix}"

  environment = {
    TABLE_NAME = aws_dynamodb_table.servers.name
    USER_POOL_ID = aws_cognito_user_pool.gawshi.id
  }
}

module "delete_server_invite" {
  source = "./modules/aws_appsync_lambda_resolver"

  type = "Mutation"
  field = "deleteServerInvite"

  appsync_graphql_api_id = aws_appsync_graphql_api.gawshi.id
  appsync_graphql_api_arn = aws_appsync_graphql_api.gawshi.arn
  datasource_service_role_arn = aws_iam_role.appsync.arn
  lambda_role_arn = aws_iam_role.lambda_exec.arn

  source_file = "${path.module}/lambdas/resolvers/deleteserver.py"
  output_path = "${path.module}/dist/lambdas/resolvers/deleteserver.zip"
  lambda_handler = "deleteserver.handler"
  function_name = "Gawshi-AppSyncResolver-DeleteServerInvite-${local.suffix}"

  environment = {
    TABLE_NAME = aws_dynamodb_table.server_invitations.name
    USER_POOL_ID = aws_cognito_user_pool.gawshi.id
  }
}
