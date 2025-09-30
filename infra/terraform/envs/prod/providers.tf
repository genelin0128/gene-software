provider "aws" {
  region = "us-east-1"
}

# 之後若要跨區，可再加 alias，如：
# provider "aws" {
#   alias  = "virginia"
#   region = "us-east-1"
# }
# provider "aws" {
#   alias  = "home"
#   region = "us-east-1"
# }
