provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}

resource "aws_acm_certificate" "site" {
  provider          = aws.virginia
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    "www.${var.domain_name}"
  ]

  lifecycle {
    create_before_destroy = true
  }
}

output "acm_validation_records" {
  description = "Add these CNAMEs in GoDaddy to validate the ACM certificate"
  value = [
    for dvo in aws_acm_certificate.site.domain_validation_options : {
      domain_name  = dvo.domain_name
      record_name  = dvo.resource_record_name
      record_type  = dvo.resource_record_type
      record_value = dvo.resource_record_value
    }
  ]
}

output "acm_certificate_arn" {
  value = aws_acm_certificate.site.arn
}
