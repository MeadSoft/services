terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    bucket = "smart-quasar-297403-terraform-state"
    prefix = "restaurant-catalog/dev"
  }
}

provider "google" {
  project = module.gcp_metadata.project_id
  region  = module.gcp_metadata.region
}

locals {
  storage_bucket_name = "${module.gcp_metadata.project_id}-${module.common_metadata.app_uri}-files"
}

# ─── Metadata ───────────────────────────────────────────────────────────────

module "common_metadata" {
  source      = "../../../modules/metadata/common"
  app_name    = "restaurant-catalog"
  environment = "dev"
}

module "gcp_metadata" {
  source     = "../../../modules/metadata/gcp"
  project_id = "smart-quasar-297403"
}

# ─── Postgres Database ───────────────────────────────────────────────────────────────

module "postgres_db" {
  source              = "../../../modules/postgres-db/gcp"
  project_id          = module.gcp_metadata.project_id
  region              = module.gcp_metadata.region
  secret_prefix       = module.common_metadata.app_uri
  db_instance_name    = module.common_metadata.app_uri
  db_name             = "restaurant_db"
  db_user             = "postgres"
  db_password         = var.db_password
  labels              = module.common_metadata.tags
  authorized_networks = []
}

# ─── Cloud Storage ───────────────────────────────────────────────────────────

resource "google_storage_bucket" "file_storage" {
  name                        = local.storage_bucket_name
  location                    = module.gcp_metadata.region
  uniform_bucket_level_access = true
  force_destroy               = true

  versioning {
    enabled = false
  }

  labels = module.common_metadata.tags
}
