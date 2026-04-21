# ─── Common GCP ───────────────────────────────────────────────────────────────

variable "project_id" {
  description = "GCP project ID."
  type        = string
}

variable "region" {
  type    = string
  default = "us-east5"
}

variable "labels" {
  type    = map(string)
  default = {}
}

# ─── Cloud SQL ───────────────────────────────────────────────────────────────

variable "db_instance_name" {
  description = "Name of the Cloud SQL instance."
  type        = string
}

variable "db_name" {
  description = "Name of the PostgreSQL database."
  type        = string
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

# ─── Secret Manager ───────────────────────────────────────────────────────────────

variable "secret_prefix" {
  description = "Prefix applied to all Secret Manager secret IDs (e.g. 'restaurant-catalog-dev-')."
  type        = string
  default     = ""
}
