variable "project_id" {
  type = string
}

variable "region" {
  type    = string
  default = "us-east5" // in gcp, this is Columbus, Ohio
}

output "project_id" {
  value = var.project_id
}

output "region" {
  value = var.region
}
