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
  storage_bucket_name  = "${module.gcp_metadata.project_id}-${module.common_metadata.app_uri}-files"
  container_image_name = "restaurant-catalog-http-api"
  ci_service_account   = "meadsoft-dev-sa@smart-quasar-297403.iam.gserviceaccount.com"
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

# ─── Service Account(s) ───────────────────────────────────────────────────────────────

resource "google_service_account" "sa" {
  account_id = module.common_metadata.app_uri
}

# ─── Artifact Registry ────────────────────────────────────────────────────────

resource "google_artifact_registry_repository" "repo" {
  repository_id = "repo"
  location      = "us"
  format        = "DOCKER"
  labels        = module.common_metadata.tags
}

resource "google_artifact_registry_repository_iam_member" "ci_writer" {
  repository = google_artifact_registry_repository.repo.id
  location   = google_artifact_registry_repository.repo.location
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${local.ci_service_account}"
}

# ─── Cloud Run ───────────────────────────────────────────────────────────────

resource "google_cloud_run_v2_service" "api" {
  name     = "${module.common_metadata.app_uri}-api"
  location = module.gcp_metadata.region

  template {
    service_account = google_service_account.sa.email

    containers {
      image = "us-docker.pkg.dev/${module.gcp_metadata.project_id}/repo/${local.container_image_name}:latest"

      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = module.postgres_db.database_url_secret_id
            version = "latest"
          }
        }
      }
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [module.postgres_db.db_connection_name]
      }
    }
  }

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }
}

# ─── Postgres Database ───────────────────────────────────────────────────────────────

module "postgres_db" {
  source                = "../../../modules/postgres-db/gcp"
  app_uri               = module.common_metadata.app_uri
  project_id            = module.gcp_metadata.project_id
  region                = module.gcp_metadata.region
  service_account_email = google_service_account.sa.email
  db_password           = var.db_password
  labels                = module.common_metadata.tags
  authorized_networks   = []
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
