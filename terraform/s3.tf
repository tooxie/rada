// It was informed in a recent article that just by knowing the name of a bucket
// a malicious actor could make the owner incur in high costs without any way
// for the victim to protect themselves. In an attempt to mitigate this risk we
// generate a random string for each bucket we create. In theory the bucket name
// is never exposed until valid credentials are provided, but just in case we
// add another layer of security. For more information see:
// https://medium.com/@maciej.pocwierz/how-an-empty-s3-bucket-can-make-your-aws-bill-explode-934a383cb8b1
resource "random_string" "music_bucket_random_suffix" {
  length = 16
  special = false
  upper = false
}

resource "random_string" "app_bucket_random_suffix" {
  length = 16
  special = false
  upper = false
}

resource "aws_s3_bucket" "gawshi_music" {
  bucket = "gawshi-music-${local.suffix}"
  force_destroy = var.force_destroy_bucket
}

resource "aws_s3_bucket_public_access_block" "gawshi_music" {
  bucket = aws_s3_bucket.gawshi_music.id

  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "gawshi_app" {
  bucket = "gawshi-app-${local.suffix}"
  force_destroy = var.force_destroy_bucket
}

resource "aws_s3_bucket_public_access_block" "gawshi_app" {
  bucket = aws_s3_bucket.gawshi_app.id

  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
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
}

output "s3_buckets" {
  value = {
    app = {
      name = aws_s3_bucket.gawshi_app.id,
      url = "https://${aws_s3_bucket.gawshi_app.bucket_domain_name}",
    },
    music = {
      name = aws_s3_bucket.gawshi_music.id,
      url = "https://${aws_s3_bucket.gawshi_music.bucket_domain_name}",
    },
  }
}
