variable "env_file_path" {
  description = "Absolute or module-relative path to the .env file used by both containers. If null, derived from app_env as .env.<app_env>."
  type        = string
  default     = null
  nullable    = true
}

variable "app_env" {
  description = "Environment selector used to derive the default env file path (.env.<app_env>)."
  type        = string
  default     = "local"
}

variable "api_image_name" {
  description = "Tag/name for the iam-http-api image."
  type        = string
  default     = "iam-http-api:latest"
}

variable "api_build_context" {
  description = "Docker build context for the iam-http-api image."
  type        = string
  default     = null
  nullable    = true
}

variable "api_dockerfile" {
  description = "Dockerfile path relative to api_build_context."
  type        = string
  default     = "Containerfile"
}

variable "api_container_name" {
  description = "Container name for the IAM API service."
  type        = string
  default     = "iam-http-api"
}

variable "api_internal_port" {
  description = "Internal container port for the IAM API service."
  type        = number
  default     = 3000
}

variable "api_external_port" {
  description = "Host port mapped to the IAM API service."
  type        = number
  default     = 3001
}

variable "postgres_image_name" {
  description = "Tag/name for the Postgres image."
  type        = string
  default     = "postgres:latest"
}

variable "postgres_container_name" {
  description = "Container name for the IAM Postgres service."
  type        = string
  default     = "iam-postgres-db"
}

variable "postgres_internal_port" {
  description = "Internal container port for Postgres."
  type        = number
  default     = 5432
}

variable "postgres_external_port" {
  description = "Host port mapped to IAM Postgres."
  type        = number
  default     = 5433
}

variable "postgres_shm_size_bytes" {
  description = "Shared memory size in bytes for Postgres container (128mb = 134217728)."
  type        = number
  default     = 134217728
}

variable "postgres_db_name" {
  description = "Name of the database to create in the Postgres container."
  type        = string
  default     = "iam"
}
