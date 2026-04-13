variable "project_id" {
  description = "GCP project ID."
  type        = string
}

variable "region" {
  description = "GCP region for all resources."
  type        = string
  default     = "us-central1"
}

# ─── Cloud SQL ───────────────────────────────────────────────────────────────

variable "db_instance_name" {
  description = "Name of the Cloud SQL instance."
  type        = string
  default     = "restaurant-catalog-dev"
}

variable "db_name" {
  description = "Name of the PostgreSQL database."
  type        = string
  default     = "restaurant_db"
}

variable "db_user" {
  description = "PostgreSQL user name."
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "PostgreSQL user password."
  type        = string
  sensitive   = true
}

variable "authorized_networks" {
  description = "List of authorized networks allowed to connect to the Cloud SQL instance directly."
  type = list(object({
    name = string
    cidr = string
  }))
  default = []
}

# ─── Secret Manager ──────────────────────────────────────────────────────────

variable "secret_prefix" {
  description = "Prefix applied to all Secret Manager secret IDs (e.g. 'restaurant-catalog-dev-')."
  type        = string
  default     = "restaurant-catalog-dev-"
}

variable "jwt_secret" {
  description = "JWT signing secret for the API."
  type        = string
  sensitive   = true
}

# ─── Cloud Storage ───────────────────────────────────────────────────────────

variable "storage_bucket_name" {
  description = "Globally unique name for the Cloud Storage file-storage bucket."
  type        = string
}
