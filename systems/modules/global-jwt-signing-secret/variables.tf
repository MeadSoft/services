variable "jwt_secret" {
  description = "JWT signing secret for the API."
  type        = string
  sensitive   = true
}
