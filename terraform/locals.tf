resource "random_uuid" "server_id" { }
resource "random_string" "suffix" {
  length = 6
  special = false
  upper = false
}

locals {
  suffix = var.suffix != "" ? var.suffix : random_string.suffix.result
  mime_types = jsondecode(file("${path.module}/mime.json"))
  app_public_url_parameter_name = "GawshiAppPublicUrl-${local.suffix}"
  cognito_admin_group_name = "Gawshi-Admin-${local.suffix}"
  server_id = "server:${random_uuid.server_id.result}"
}

output "server_id" {
  value = local.server_id
}

output "suffix" {
  value = local.suffix
}
