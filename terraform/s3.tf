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
