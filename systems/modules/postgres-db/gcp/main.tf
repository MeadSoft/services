# ─── Cloud SQL ───────────────────────────────────────────────────────────────

resource "google_sql_database_instance" "postgres" {
  name             = var.db_instance_name
  database_version = "POSTGRES_18"
  region           = var.region

  settings {
    tier              = "db-f1-micro"
    availability_type = "ZONAL"
    disk_size         = 10
    disk_type         = "PD_SSD"
    disk_autoresize   = true

    backup_configuration {
      enabled = true
    }

    ip_configuration {
      ipv4_enabled = true

      dynamic "authorized_networks" {
        for_each = var.authorized_networks
        content {
          name  = authorized_networks.value.name
          value = authorized_networks.value.cidr
        }
      }
    }

    database_flags {
      name  = "max_connections"
      value = "100"
    }

    user_labels = merge({ terraform = true }, var.labels)
  }

  deletion_protection = true

}

resource "google_sql_database" "app_db" {
  name     = var.db_name
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "app_user" {
  name     = var.db_user
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
}

# ─── Secret Manager ───────────────────────────────────────────────────────────────

resource "google_secret_manager_secret" "database_url" {
  secret_id = "${var.secret_prefix}-database-url"

  replication {
    auto {}
  }

  labels = merge({ terraform = true }, var.labels)
}

resource "google_secret_manager_secret_version" "database_url" {
  secret      = google_secret_manager_secret.database_url.id
  secret_data = "postgresql://${var.db_user}:${var.db_password}@${google_sql_database_instance.postgres.public_ip_address}:5432/${var.db_name}"
}

resource "google_secret_manager_secret" "db_password" {
  secret_id = "${var.secret_prefix}-db-password"

  replication {
    auto {}
  }

  labels = merge({ terraform = true }, var.labels)
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = var.db_password
}
