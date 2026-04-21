variable "app_name" {
  type = string
}

variable "environment" {
  type = string

  validation {
    condition     = contains(["local", "dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of: local, dev, staging, prod."
  }
}

output "app_name" {
  value = var.app_name
}

output "environment" {
  value = var.environment
}

output "app_uri" {
  value = "${var.app_name}-${var.environment}"
}

output "tags" {
  value = {
    app         = var.app_name
    environment = var.environment
    terraform   = true
  }
}
