output "jwt_secret_secret_id" {
  description = "Secret Manager secret ID for the JWT signing secret."
  value       = google_secret_manager_secret.jwt_secret.secret_id
}
