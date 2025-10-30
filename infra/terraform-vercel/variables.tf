variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "folio-site"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, production)"
  type        = string
  default     = "production"
}

variable "team_name" {
  description = "Vercel team name (leave empty for personal account)"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Custom domain name for the site"
  type        = string
  default     = "portfolio.coka.id.vn"
}

variable "manage_dns" {
  description = "Whether to manage DNS records via Terraform"
  type        = bool
  default     = false
}

variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "CokaVN11"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "folio-site"
}

variable "kv_region" {
  description = "Vercel KV database region"
  type        = string
  default     = "sin1"
}

variable "project_framework" {
  description = "Project framework"
  type        = string
  default     = "nextjs"
}

variable "vercel_api_token" {
  description = "Vercel API token for authentication"
  type        = string
  default     = ""
  sensitive   = true
}

variable "build_command" {
  description = "Build command for the project"
  type        = string
  default     = "cd apps/web && pnpm build"
}

variable "output_directory" {
  description = "Output directory for build artifacts"
  type        = string
  default     = ".next"
}

variable "install_command" {
  description = "Install command for dependencies"
  type        = string
  default     = "pnpm install"
}

variable "dev_command" {
  description = "Development command"
  type        = string
  default     = "cd apps/web && pnpm dev"
}

variable "root_directory" {
  description = "Root directory for the project"
  type        = string
}

variable "collaborators" {
  description = "List of project collaborators"
  type = list(object({
    username = string
    role     = string
  }))
  default = []
}

variable "cors_origins" {
  description = "Allowed CORS origins"
  type        = list(string)
  default = [
    "https://portfolio.coka.id.vn",
    "https://www.portfolio.coka.id.vn"
  ]
}

variable "custom_environment_variables" {
  description = "Custom environment variables for the project"
  type = list(object({
    key       = string
    value     = string
    target    = list(string)
    sensitive = optional(bool, false)
  }))
  default = []
}

variable "vercel_verification_code" {
  description = "Vercel domain verification code (TXT record)"
  type        = string
  default     = ""
}
