terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "run.googleapis.com",
    "sql-component.googleapis.com",
    "sqladmin.googleapis.com",
    "containerregistry.googleapis.com",
    "artifactregistry.googleapis.com"
  ])
  
  project = var.project_id
  service = each.value
  
  disable_on_destroy = false
}

# Create Artifact Registry repository
resource "google_artifact_registry_repository" "app_repo" {
  repository_id = "${var.app_name}-repo"
  location      = var.region
  format        = "DOCKER"
  description   = "Docker repository for ${var.app_name}"
  
  depends_on = [google_project_service.required_apis]
}

# Create Cloud SQL instance
resource "google_sql_database_instance" "main" {
  name             = "${var.app_name}-db-instance"
  database_version = "POSTGRES_15"
  region           = var.region
  
  settings {
    tier = "db-f1-micro"
    
    database_flags {
      name  = "cloudsql.iam_authentication"
      value = "on"
    }
    
    backup_configuration {
      enabled = true
    }
    
    ip_configuration {
      ipv4_enabled    = true
      authorized_networks {
        name  = "all"
        value = "0.0.0.0/0"
      }
    }
  }
  
  deletion_protection = false
  depends_on = [google_project_service.required_apis]
}

# Create database
resource "google_sql_database" "database" {
  name     = var.app_name
  instance = google_sql_database_instance.main.name
}

# Create database user
resource "google_sql_user" "user" {
  name     = "app_user"
  instance = google_sql_database_instance.main.name
  password = var.db_password
}

# Create Cloud Run service
resource "google_cloud_run_service" "app" {
  name     = var.app_name
  location = var.region
  
  template {
    spec {
      containers {
        image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app_repo.name}/${var.app_name}:latest"
        
        ports {
          container_port = 8080
        }
        
        env {
          name  = "DATABASE_URL"
          value = "postgresql://${google_sql_user.user.name}:${var.db_password}@${google_sql_database_instance.main.public_ip_address}:5432/${google_sql_database.database.name}"
        }
        
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
    
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "10"
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.main.connection_name
      }
    }
  }
  
  traffic {
    percent         = 100
    latest_revision = true
  }
  
  depends_on = [google_project_service.required_apis]
}

# Make Cloud Run service publicly accessible
resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.app.location
  project  = google_cloud_run_service.app.project
  service  = google_cloud_run_service.app.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}