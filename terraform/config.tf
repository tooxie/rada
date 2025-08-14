resource "null_resource" "install_deps" {
  triggers = {
    package_json_md5 = filemd5("../client/package.json")
  }

  provisioner "local-exec" {
    command = join(" ", [
      "cd ../client;",
      "yarn install --silent",
    ])
  }
}

resource "null_resource" "codegen_exec" {
  triggers = {
    graphql_schema_md5 = filemd5("./schema.graphql")
  }

  provisioner "local-exec" {
    command = join(" ", [
      "cd ../client;",
      "yarn run codegen;",
    ])
  }

  depends_on = [
    null_resource.install_deps,
    null_resource.codegen_config,
    aws_appsync_graphql_api.gawshi,
  ]
}

resource "null_resource" "codegen_config" {
  triggers = {
    appsync_id = aws_appsync_graphql_api.gawshi.id
    region = var.region
  }

  provisioner "local-exec" {
    when = destroy
    command = join(" ", [
      "cd ../client;",
      "yarn run codegen:destroy",
    ])
  }

  provisioner "local-exec" {
    command = join(" ", [
      "cd ../client;",
      "yarn run codegen:config --",
      "--api-id", aws_appsync_graphql_api.gawshi.id,
      "--region", var.region,
    ])
  }
}

resource "null_resource" "app_config" {
  triggers = {
    api_url = lookup(aws_appsync_graphql_api.gawshi.uris, "GRAPHQL")
    client_id = aws_cognito_user_pool_client.gawshi.id
    cognito_admin_group_name = local.cognito_admin_group_name
    id_pool_id = aws_cognito_identity_pool.gawshi.id
    idp_url = aws_cognito_user_pool.gawshi.endpoint
    region = var.region
    server_id = local.server_id
    server_name = var.server_name,
    user_pool_id = aws_cognito_user_pool.gawshi.id
  }

  provisioner "local-exec" {
    when = destroy
    command = join(" ", [
      "cd ../client;",
      "yarn run app:destroy",
    ])
  }

  provisioner "local-exec" {
    command = join(" ", [
      "cd ../client;",
      "yarn run app:config --",
      "--api-url", lookup(aws_appsync_graphql_api.gawshi.uris, "GRAPHQL"),
      "--client-id", aws_cognito_user_pool_client.gawshi.id,
      "--id-pool-id", aws_cognito_identity_pool.gawshi.id,
      "--idp-url", aws_cognito_user_pool.gawshi.endpoint,
      "--region", var.region,
      "--server-id", local.server_id,
      "--server-name", var.server_name,
      "--user-pool-id", aws_cognito_user_pool.gawshi.id,
      "--cognito-admin-group-name", local.cognito_admin_group_name,
    ])
  }
}

resource "null_resource" "root_user_config" {
  triggers = {
    user_username = aws_cognito_user.root.username
    user_password = aws_cognito_user.root.password
  }

  provisioner "local-exec" {
    when = destroy
    command = join(" ", [
      "cd ../client;",
      "yarn run cognito:rootuser:destroy",
    ])
  }

  provisioner "local-exec" {
    command = join(" ", [
      "cd ../client;",
      "yarn run cognito:rootuser:config --",
      "--username", aws_cognito_user.root.username,
      "--password", aws_cognito_user.root.password,
    ])
  }
}

resource "null_resource" "shiva_config" {
  triggers = {
    appsync_url = lookup(aws_appsync_graphql_api.gawshi.uris, "GRAPHQL")
    cognito_app_client = aws_cognito_user_pool_client.gawshi.id
    cognito_username = aws_cognito_user.root.username
    region = aws_s3_bucket.gawshi_music.region
    s3_bucket_name = aws_s3_bucket.gawshi_music.bucket
    s3_bucket_url = aws_s3_bucket.gawshi_music.bucket_domain_name
    ssm_parameter_password = aws_ssm_parameter.root_password.name
    ssm_parameter_username = aws_ssm_parameter.root_username.name
  }

  provisioner "local-exec" {
    command = join(" ", [
      "cd ../shiva;",
      "./scripts/config.py",
      "--api-url", lookup(aws_appsync_graphql_api.gawshi.uris, "GRAPHQL"),
      "--bucket-name", aws_s3_bucket.gawshi_music.bucket,
      "--bucket-url", "https://${aws_s3_bucket.gawshi_music.bucket_domain_name}",
      "--ssm-parameter-username", aws_ssm_parameter.root_username.name,
      "--ssm-parameter-password", aws_ssm_parameter.root_password.name,
      "--cognito-client-id", aws_cognito_user_pool_client.gawshi.id,
      "--region", aws_s3_bucket.gawshi_music.region,
    ])
  }
}

# This resource is not intended to work as a CI/CD mechanism. In fact it will
# not update the app if the code changes, it will only redeploy it if any of the
# config changes which would break the app. It's intended only to keep the app
# working, not up to date.
resource "null_resource" "gawshi_app_build" {
  triggers = {
    appsync_id = aws_appsync_graphql_api.gawshi.id
    appsync_url = lookup(aws_appsync_graphql_api.gawshi.uris, "GRAPHQL")
    client_id = aws_cognito_user_pool_client.gawshi.id
    graphql_schema_md5 = filemd5("./schema.graphql")
    id_pool_id = aws_cognito_identity_pool.gawshi.id
    region = var.region
    s3_app_bucket_url = aws_s3_bucket.gawshi_app.bucket_domain_name
    s3_music_bucket_url = aws_s3_bucket.gawshi_music.bucket_domain_name
    server_id = local.server_id
    server_name = var.server_name,
    user_pool_id = aws_cognito_user_pool.gawshi.id
    user_pool_url = aws_cognito_user_pool.gawshi.id
  }

  provisioner "local-exec" {
    command = join(" ", [
      "cd ../client;",
      "yarn run build > /dev/null",
    ])
  }

  depends_on = [
    null_resource.install_deps,
    null_resource.codegen_exec,
  ]
}

# TODO: How can we display a QR code with the URL in the outputs? And should we?
# resource "null_resource" "gawshi_app_qr_code" {
#   provisioner "local-exec" {
#     command = "cd ../client; yarn qrcode"
#   }
#
#   depends_on = [
#     aws_s3_bucket.gawshi_app,
#   ]
# }

# TODO: Do not deploy through the aws_s3_object hack, instead write a deploy
# TODO: script and call that instead.
# resource "null_resource" "gawshi_app_build" {
#   provisioner "local-exec" {
#     command = "cd ../client; yarn deploy"
#   }
# }
