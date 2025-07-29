output "app_url" {
  description = "URL of the deployed Azure Web App"
  value       = "https://${azurerm_web_app.webapp.default_site_hostname}"
}

output "database_fqdn" {
  description = "Fully Qualified Domain Name (FQDN) of the Azure PostgreSQL server"
  value       = azurerm_postgresql_server.postgres_server.fqdn
}

output "registry_login_server" {
  description = "Azure Container Registry login server URL"
  value       = azurerm_container_registry.acr.login_server
}
