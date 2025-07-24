output "app_url" {
  description = "URL of the deployed application"
  value       = google_cloud_run_service.app.status[0].url
}

output "database_ip" {
  description = "Database IP address"
  value       = google_sql_database_instance.main.public_ip_address
}

output "registry_url" {
  description = "Artifact Registry URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app_repo.name}"
}