output "storage_bucket_name" {
  description = "Name of the Cloud Storage file-storage bucket."
  value       = google_storage_bucket.file_storage.name
}

output "storage_bucket_url" {
  description = "gs:// URL of the Cloud Storage file-storage bucket."
  value       = google_storage_bucket.file_storage.url
}
