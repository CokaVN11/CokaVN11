terraform {
  required_version = ">= 1.5"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # Remote state management - separate from AWS infrastructure
  backend "s3" {
    bucket = "folio-terraform-state-ap-southeast-1"
    key    = "folio-site/vercel/terraform.tfstate"
    region = "ap-southeast-1"

    use_lockfile = true
    encrypt      = true
  }
}

# Configure Vercel provider
provider "vercel" {
  # API token can be set via VERCEL_API_TOKEN environment variable
  # Or create a vercel.tfvars file with the token
  api_token = var.vercel_api_token
}

# Configure AWS provider for DNS management (if using Route53)
provider "aws" {
  region = "ap-southeast-1"

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
      Provider    = "Vercel"
    }
  }
}

# Data sources
data "aws_route53_zone" "main" {
  count = var.manage_dns && var.domain_name != "" ? 1 : 0
  name  = var.domain_name
}

# Random suffix for unique resource naming
resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

locals {
  # Build framework mapping
  framework = "nextjs"

  # Default Git repository
  git_repository = {
    type = "github"
    repo = "${var.github_owner}/${var.github_repo}"
  }

  # Environment variables for all environments
  common_env_vars = {
    NODE_ENV       = "production"
    ALLOWED_ORIGIN = "https://${var.domain_name != "" ? var.domain_name : "localhost:3000"}"
  }
}
