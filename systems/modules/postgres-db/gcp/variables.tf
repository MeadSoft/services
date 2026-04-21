# ─── Common ───────────────────────────────────────────────────────────────

variable "app_uri" {
  description = "The name of the application that may contain more metadata, such as environment and region. Used as a prefix for resource names and secrets."
  type        = string
}

variable "labels" {
  type    = map(string)
  default = {}
}

# ─── Common GCP ───────────────────────────────────────────────────────────────

variable "project_id" {
  description = "GCP project ID."
  type        = string
}

variable "region" {
  type    = string
  default = "us-east5"
}

variable "service_account_email" {
  type = string
}

# ─── Cloud SQL ───────────────────────────────────────────────────────────────

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
