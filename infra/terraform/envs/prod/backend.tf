terraform {
  required_version = ">= 1.3.0"
  backend "s3" {
    bucket         = "gene-software-tfstate-098336614895-prod"
    key            = "envs/prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "gene-software-tf-lock-prod"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
