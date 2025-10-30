# Custom Domain Configuration for Vercel Project

# Add custom domain to Vercel project
resource "vercel_project_domain" "main" {
  count      = var.domain_name != "" ? 1 : 0
  project_id = vercel_project.folio.id
  domain     = var.domain_name

  # Automatic HTTPS certificate management
  # Vercel automatically handles SSL certificate provisioning and renewal

  # Domain verification
  # Vercel will provide DNS records for domain verification
  # These can be managed via Terraform if manage_dns = true
}

# Add www subdomain redirect
resource "vercel_project_domain" "www" {
  count      = var.domain_name != "" ? 1 : 0
  project_id = vercel_project.folio.id
  domain     = "www.${var.domain_name}"

  # Redirect www to non-www
  redirect = var.domain_name
}

# Optional: DNS Management via Route53
resource "aws_route53_record" "vercel_main" {
  count   = var.manage_dns && var.domain_name != "" ? 1 : 0
  zone_id = data.aws_route53_zone.main[0].zone_id
  name    = var.domain_name
  type    = "CNAME"
  ttl     = 300

  records = ["cname.vercel-dns.com"]
}

resource "aws_route53_record" "vercel_www" {
  count   = var.manage_dns && var.domain_name != "" ? 1 : 0
  zone_id = data.aws_route53_zone.main[0].zone_id
  name    = "www.${var.domain_name}"
  type    = "CNAME"
  ttl     = 300

  records = ["cname.vercel-dns.com"]
}

# DNS verification records (if needed for domain ownership)
# Vercel provides these records automatically for domain verification
# They can be added here if you need to manage them via Terraform

# TXT record for domain verification (example)
resource "aws_route53_record" "vercel_verification" {
  count   = var.manage_dns && var.domain_name != "" && var.vercel_verification_code != "" ? 1 : 0
  zone_id = data.aws_route53_zone.main[0].zone_id
  name    = var.domain_name
  type    = "TXT"
  ttl     = 300

  records = [var.vercel_verification_code]
}