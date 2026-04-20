output "db_instance_name" {
  description = "Name of the Cloud SQL instance."
  value       = google_sql_database_instance.postgres.name
}

output "db_connection_name" {
  description = "Cloud SQL connection name (used with Cloud SQL Auth Proxy)."
  value       = google_sql_database_instance.postgres.connection_name
}

output "db_public_ip" {
  description = "Public IP address of the Cloud SQL instance."
  value       = google_sql_database_instance.postgres.public_ip_address
}

output "database_url_secret_id" {
  description = "Secret Manager secret ID for the DATABASE_URL connection string."
  value       = google_secret_manager_secret.database_url.secret_id
}

output "db_password_secret_id" {
  description = "Secret Manager secret ID for the database password."
  value       = google_secret_manager_secret.db_password.secret_id
}

output "jwt_secret_secret_id" {
  description = "Secret Manager secret ID for the JWT signing secret."
  value       = google_secret_manager_secret.jwt_secret.secret_id
}

output "storage_bucket_name" {
  description = "Name of the Cloud Storage file-storage bucket."
  value       = google_storage_bucket.file_storage.name
}

output "storage_bucket_url" {
  description = "gs:// URL of the Cloud Storage file-storage bucket."
  value       = google_storage_bucket.file_storage.url
}
