# 取得帳號 ID 給 CloudFront ARN 用
data "aws_caller_identity" "current" {}

# ---- S3 權限（直接引用本 module 的 S3 資源）----
# 你的 S3 網站桶在同一個狀態檔中：aws_s3_bucket.site
data "aws_iam_policy_document" "deploy_s3" {
  statement {
    sid = "S3SiteWrite"
    actions = [
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:DeleteObject",
      "s3:DeleteObjectVersion",
      "s3:ListBucket",
      "s3:GetObject",
      "s3:GetBucketLocation"
    ]
    resources = [
      "arn:aws:s3:::${aws_s3_bucket.site.bucket}",
      "arn:aws:s3:::${aws_s3_bucket.site.bucket}/*"
    ]
  }
}

resource "aws_iam_policy" "deploy_s3" {
  name   = "gene-software-deploy-s3-prod"
  policy = data.aws_iam_policy_document.deploy_s3.json
}

# ---- CloudFront Invalidation（直接引用本 module 的 Distribution ID）----
# 你的 Distribution 在同一個狀態檔中：aws_cloudfront_distribution.site
data "aws_iam_policy_document" "deploy_cf" {
  statement {
    sid     = "CFInvalidate"
    actions = ["cloudfront:CreateInvalidation"]
    resources = [
      "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/${aws_cloudfront_distribution.site.id}"
    ]
  }
}

resource "aws_iam_policy" "deploy_cf" {
  name   = "gene-software-deploy-cf-prod"
  policy = data.aws_iam_policy_document.deploy_cf.json
}

# ---- 附加到部署角色 ----
resource "aws_iam_role_policy_attachment" "attach_s3" {
  role       = aws_iam_role.github_deploy.name
  policy_arn = aws_iam_policy.deploy_s3.arn
}

resource "aws_iam_role_policy_attachment" "attach_cf" {
  role       = aws_iam_role.github_deploy.name
  policy_arn = aws_iam_policy.deploy_cf.arn
}
