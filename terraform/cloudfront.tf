locals {
  api_gateway_domain_name = replace(aws_api_gateway_stage.gawshi.invoke_url, "/^https?://([^/]*).*/", "$1")
  api_gateway_origin_id = "gawshi-apigw-${aws_api_gateway_rest_api.gawshi.id}"
}

resource "aws_cloudfront_origin_access_identity" "gawshi_app_ssl" {
  comment = "OAI for ${aws_s3_bucket.gawshi_app.bucket}"
}

resource "aws_cloudfront_distribution" "gawshi_app_ssl" {
  enabled = true
  default_root_object = "index.html"

  origin {
    domain_name = local.api_gateway_domain_name
    # domain_name = aws_api_gateway_stage.gawshi.invoke_url
    origin_id = local.api_gateway_origin_id
    origin_path = "/${aws_api_gateway_stage.gawshi.stage_name}"

    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }

  origin {
    domain_name = aws_s3_bucket.gawshi_app.bucket_regional_domain_name
    origin_id = aws_s3_bucket.gawshi_app.bucket

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.gawshi_app_ssl.cloudfront_access_identity_path
    }
  }

  custom_error_response {
    error_code = 403
    response_code = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code = 404
    response_code = 200
    response_page_path = "/index.html"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  ordered_cache_behavior {
    path_pattern = "/invite/*"
    allowed_methods = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods = ["HEAD", "GET", "OPTIONS"]
    target_origin_id = local.api_gateway_origin_id

    compress = true
    # default_ttl = 0
    # min_ttl = 0
    # max_ttl = 0
    viewer_protocol_policy = "https-only"

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }
  }

  default_cache_behavior {
    allowed_methods = ["HEAD", "GET", "OPTIONS"]
    cached_methods = ["HEAD", "GET"]
    target_origin_id = aws_s3_bucket.gawshi_app.bucket
    compress = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }
  }
}

resource "aws_ssm_parameter" "app_public_url" {
  name = local.app_public_url_parameter_name
  type = "String"
  value = aws_cloudfront_distribution.gawshi_app_ssl.domain_name
}

output "public_url" {
  value = "https://${aws_cloudfront_distribution.gawshi_app_ssl.domain_name}"
}
