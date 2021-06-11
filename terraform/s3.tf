resource "aws_s3_bucket" "gawshi_music" {
  bucket = "gawshi-music-${local.suffix}"
  force_destroy = var.force_destroy_bucket

  tags = {
    Gawshi = "1"
  }
}

resource "aws_s3_bucket_public_access_block" "gawshi_music" {
  bucket = aws_s3_bucket.gawshi_music.id

  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "null_resource" "shiva_config" {
  triggers = {
    appsync_url = lookup(aws_appsync_graphql_api.gawshi.uris, "GRAPHQL")
    region = aws_s3_bucket.gawshi_music.region
    s3_bucket_name = aws_s3_bucket.gawshi_music.bucket
    s3_bucket_url = aws_s3_bucket.gawshi_music.bucket_domain_name
    cognito_username = aws_cognito_user.root.username
    ssm_parameter_username = aws_ssm_parameter.root_username.name
    ssm_parameter_password = aws_ssm_parameter.root_password.name
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

resource "aws_s3_bucket" "gawshi_app" {
  bucket = "gawshi-app-${local.suffix}"
  force_destroy = var.force_destroy_bucket

  tags = {
    Gawshi = "1"
  }
}

# This resource is not intended to work as a CI/CD mechanism. In fact it will
# not update the app if the code changes, it will only redeploy it if any of the
# config changes which would break the app. It's intended only to keep the app
# working, not up to date.
resource "null_resource" "gawshi_app_build" {
  triggers = {
    app_client_id = aws_cognito_user_pool_client.gawshi.id
    appsync_id = aws_appsync_graphql_api.gawshi.id
    appsync_url = lookup(aws_appsync_graphql_api.gawshi.uris, "GRAPHQL")
    cognito_identity_pool_id = aws_cognito_identity_pool.gawshi.id
    cognito_user_pool_id = aws_cognito_user_pool.gawshi.id
    region = var.region
    s3_app_bucket_url = aws_s3_bucket.gawshi_app.bucket_domain_name
    s3_music_bucket_url = aws_s3_bucket.gawshi_music.bucket_domain_name
  }

  provisioner "local-exec" {
    command = "cd ../client; yarn build > /dev/null"
  }
}

resource "aws_s3_bucket_public_access_block" "gawshi_app" {
  bucket = aws_s3_bucket.gawshi_app.id

  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_acl" "gawshi_app" {
  bucket = aws_s3_bucket.gawshi_app.id
  acl = "private"
}

resource "aws_s3_bucket_policy" "gawshi_app" {
  bucket = aws_s3_bucket.gawshi_app.id
  policy = data.aws_iam_policy_document.gawshi_app.json
}

data "aws_iam_policy_document" "gawshi_app" {
  statement {
    principals {
      type = "AWS"
      identifiers = [
        aws_cloudfront_origin_access_identity.gawshi_app_ssl.iam_arn
      ]
    }
    actions = [
      "s3:GetObject",
    ]
    effect = "Allow"
    resources = [
      "${aws_s3_bucket.gawshi_app.arn}/*",
    ]
  }
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
resource "aws_s3_object" "gawshi_app_file" {
  for_each = fileset(var.website_root, "**")
  bucket = aws_s3_bucket.gawshi_app.bucket
  key = each.key
  source = "${var.website_root}/${each.key}"
  source_hash = filemd5("${var.website_root}/${each.key}")
  force_destroy = true
  content_type = lookup(local.mime_types, regex("\\.[^.]+$", each.key), null)

  tags = {
    Gawshi = "1"
  }
}

output "s3_music_bucket_url" {
  value = aws_s3_bucket.gawshi_music.bucket_domain_name
}

output "s3_app_bucket_url" {
  value = aws_s3_bucket.gawshi_app.bucket_domain_name
}
