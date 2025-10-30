# Vercel Infrastructure Outputs

# Project Information
output "vercel_project_id" {
  description = "Vercel project ID"
  value       = vercel_project.folio.id
}

output "vercel_project_name" {
  description = "Vercel project name"
  value       = vercel_project.folio.name
}

output "vercel_project_url" {
  description = "Primary Vercel project URL"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "https://${vercel_project.folio.name}.vercel.app"
}

# Deployment URLs
output "preview_deployment_url" {
  description = "Latest preview deployment URL"
  value       = vercel_deployment.preview.url
}

output "production_deployment_url" {
  description = "Production deployment URL"
  value       = vercel_deployment.production.url
}

# Domain Information
output "custom_domain" {
  description = "Custom domain configuration"
  value = var.domain_name != "" ? {
    domain = var.domain_name
    url    = "https://${var.domain_name}"
  } : null
}

output "www_domain" {
  description = "WWW subdomain configuration"
  value = var.domain_name != "" ? {
    domain   = "www.${var.domain_name}"
    url      = "https://www.${var.domain_name}"
    redirect = var.domain_name
  } : null
}

# Team Information
output "team_name" {
  description = "Vercel team name"
  value       = var.team_name
}

output "team_note" {
  description = "Note about team management"
  value       = "Team management must be configured manually in Vercel dashboard"
}

# Build and Configuration
output "build_configuration" {
  description = "Project build configuration"
  value = {
    framework        = var.project_framework
    build_command    = var.build_command
    output_directory = var.output_directory
    install_command  = var.install_command
    root_directory   = var.root_directory
    git_repository   = local.git_repository.repo
  }
}

# Environment Variables Summary
output "environment_variables" {
  description = "Summary of configured environment variables"
  value = {
    production_count = length([
      for var in vercel_project_environment_variable.production : var
    ])
    total_count = length([
      for var in vercel_project_environment_variable.production : var
      ]) + length([
      for var in vercel_project_environment_variable.preview_node_env : var
      ]) + length([
      for var in vercel_project_environment_variable.custom_env_vars : var
    ])
  }
}

# Access Control Summary
output "access_control" {
  description = "Access control configuration summary"
  value = {
    collaborators_count    = length(var.collaborators)
    using_team             = var.team_name != ""
    team_collaborators     = var.team_name != "" ? length(var.collaborators) : 0
    personal_collaborators = var.team_name == "" ? length(var.collaborators) : 0
  }
}

# Migration Information
output "migration_info" {
  description = "Information for AWS to Vercel migration"
  value = {
    old_aws_api_url    = "https://your-previous-api-gateway-url.com"
    new_vercel_api_url = "${var.domain_name != "" ? "https://${var.domain_name}" : "https://${vercel_project.folio.name}.vercel.app"}/api/contact"
    backend_state      = "requires-manual-kv-setup"
    hosting_state      = "migrated-to-vercel-edge"
  }
}

# DNS Records (for manual DNS management)
output "dns_records" {
  description = "DNS records needed for domain configuration"
  value = var.domain_name != "" ? {
    main_domain = {
      type  = "CNAME"
      name  = var.domain_name
      value = "cname.vercel-dns.com"
      ttl   = 300
    }
    www_domain = {
      type  = "CNAME"
      name  = "www.${var.domain_name}"
      value = "cname.vercel-dns.com"
      ttl   = 300
    }
  } : null
}

# KV Database Setup Instructions
output "kv_database_setup" {
  description = "Instructions for manual KV database setup"
  value = {
    requirement = "KV database must be created manually in Vercel dashboard"
    steps = [
      "1. Go to Vercel Dashboard → Storage",
      "2. Create Database → KV (Redis)",
      "3. Select region: sin1 (Singapore)",
      "4. Copy connection details",
      "5. Add KV environment variables in Vercel project settings",
      "6. Variables needed: KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN"
    ]
    alternative = "Or continue using existing AWS DynamoDB infrastructure"
  }
}