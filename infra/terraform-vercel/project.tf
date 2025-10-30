# --- Project ---
resource "vercel_project" "folio" {
  name      = "${var.project_name}-${var.environment}"
  framework = var.project_framework # e.g. "nextjs"

  # Build & output settings (supported by provider)
  build_command    = var.build_command
  install_command  = var.install_command
  dev_command      = var.dev_command
  output_directory = var.output_directory
  root_directory   = var.root_directory

  git_repository = {
    production_branch = "main"
    type              = "github"
    repo              = local.git_repository.repo
  }
}

# --- Preview deployment from Git (non-production) ---
resource "vercel_deployment" "preview" {
  project_id = vercel_project.folio.id
  ref        = "main" # branch or commit
  production = false
}

# --- Production deployment from Git ---
resource "vercel_deployment" "production" {
  project_id = vercel_project.folio.id
  ref        = "main" # branch or commit
  production = true
}
