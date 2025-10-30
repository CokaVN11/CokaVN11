# Environment Variables for Vercel Project

# Production environment variables
resource "vercel_project_environment_variable" "production" {
  project_id = vercel_project.folio.id
  key        = "NODE_ENV"
  value      = "production"
  target     = ["production"]
}

# CORS Configuration
resource "vercel_project_environment_variable" "allowed_origin" {
  project_id = vercel_project.folio.id
  key        = "ALLOWED_ORIGIN"
  value      = var.domain_name != "" ? "https://${var.domain_name}" : "https://localhost:3000"
  target     = ["production"]
}

# Preview/Development Environment Variables
resource "vercel_project_environment_variable" "preview_node_env" {
  project_id = vercel_project.folio.id
  key        = "NODE_ENV"
  value      = "development"
  target     = ["preview", "development"]
}

# GitHub repository info for builds
resource "vercel_project_environment_variable" "github_repo" {
  project_id = vercel_project.folio.id
  key        = "GITHUB_REPO"
  value      = local.git_repository.repo
  target     = ["preview", "development", "production"]
}

# Custom environment variables from terraform.tfvars
resource "vercel_project_environment_variable" "custom_env_vars" {
  for_each   = { for env in var.custom_environment_variables : env.key => env }
  project_id = vercel_project.folio.id
  key        = each.value.key
  value      = each.value.value
  target     = each.value.target
  sensitive  = lookup(each.value, "sensitive", false)
}