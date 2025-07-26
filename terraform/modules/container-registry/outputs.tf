output "repository_url" {
  description = "The Azure Container Registry login server URL"
  value       = azurerm_container_registry.acr.login_server
}
