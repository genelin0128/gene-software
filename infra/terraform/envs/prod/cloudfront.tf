# --- CloudFront OAC ---
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "gene-software-oac-prod"
  description                       = "OAC for S3 private origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# --- CloudFront Distribution ---
locals {
  aliases = [
    var.domain_name,
    "www.${var.domain_name}"
  ]
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "gene-software static site (prod)"
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  aliases = local.aliases

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    compress               = true

    # 仍沿用 forwarded_values（簡單、夠用）
    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }

    # ★ 正確放置：跟 forwarded_values 同層級、在 default_cache_behavior 內
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.rewrite_index.arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.site.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # 讓 Terraform 等到發佈完成（較直覺）
  wait_for_deployment = true
}

# --- S3 Bucket Policy: 僅允許此 CloudFront Distribution 讀取 ---
data "aws_iam_policy_document" "site_bucket" {
  statement {
    sid       = "AllowCloudFrontReadOAC"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.site_bucket.json
}

# 輸出
output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.site.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.site.id
}
