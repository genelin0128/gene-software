resource "aws_cloudfront_function" "rewrite_index" {
  name    = "gene-software-rewrite-index-prod"
  runtime = "cloudfront-js-2.0"
  comment = "Rewrite directory requests to index.html"
  publish = true
  code    = file("${path.module}/functions/rewrite-index.js")
}
