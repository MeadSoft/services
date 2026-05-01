output "api_container_id" {
  description = "Container ID for the iam-http-api service."
  value       = docker_container.iam_http_api.id
}

output "api_container_name" {
  description = "Container name for the iam-http-api service."
  value       = docker_container.iam_http_api.name
}

output "postgres_container_id" {
  description = "Container ID for the IAM postgres service."
  value       = docker_container.postgres_db.id
}

output "postgres_container_name" {
  description = "Container name for the IAM postgres service."
  value       = docker_container.postgres_db.name
}

output "api_url" {
  description = "Local URL for the IAM API service."
  value       = "http://localhost:${var.api_external_port}"
}
