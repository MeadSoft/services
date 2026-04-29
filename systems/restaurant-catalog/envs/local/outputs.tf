output "api_container_id" {
  description = "Container ID for the restaurant-catalog-http-api service."
  value       = docker_container.restaurant_catalog_http_api.id
}

output "api_container_name" {
  description = "Container name for the restaurant-catalog-http-api service."
  value       = docker_container.restaurant_catalog_http_api.name
}

output "postgres_container_id" {
  description = "Container ID for the postgres service."
  value       = docker_container.postgres_db.id
}

output "postgres_container_name" {
  description = "Container name for the postgres service."
  value       = docker_container.postgres_db.name
}

output "api_url" {
  description = "Local URL for the API service."
  value       = "http://localhost:${var.api_external_port}"
}
