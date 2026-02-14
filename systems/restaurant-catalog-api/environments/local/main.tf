terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

locals {
  default_env_file_path     = "${path.module}/../../../../apps/restaurant-catalog-api/.env.${var.app_env}"
  default_api_build_context = "${path.module}/../../../../apps/restaurant-catalog-api"
  env_file_path             = var.env_file_path != null ? var.env_file_path : local.default_env_file_path
  api_build_context         = var.api_build_context != null ? var.api_build_context : local.default_api_build_context
  env_vars = [
    for line in split("\n", file(local.env_file_path)) : trimspace(line)
    if length(trimspace(line)) > 0 && !startswith(trimspace(line), "#")
  ]
}

resource "docker_image" "restaurant_catalog_api" {
  name = var.api_image_name

  build {
    context    = local.api_build_context
    dockerfile = var.api_dockerfile
  }
}

resource "docker_image" "postgres" {
  name = var.postgres_image_name
}

resource "docker_container" "postgres_db" {
  name     = var.postgres_container_name
  image    = docker_image.postgres.image_id
  restart  = "always"
  shm_size = var.postgres_shm_size_bytes
  must_run = true
  env      = local.env_vars

  ports {
    internal = var.postgres_internal_port
    external = var.postgres_external_port
  }
}

resource "docker_container" "restaurant_catalog_api" {
  name     = var.api_container_name
  image    = docker_image.restaurant_catalog_api.image_id
  restart  = "always"
  must_run = true
  env      = local.env_vars

  ports {
    internal = var.api_internal_port
    external = var.api_external_port
  }

  depends_on = [docker_container.postgres_db]
}
