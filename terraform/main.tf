terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "subscription_id" {
  type        = string
  description = "Azure Subscription ID"
}

variable "resource_group_name" {
  type        = string
  description = "Azure Resource Group name"
}

variable "location" {
  type        = string
  description = "Azure region, e.g. eastus, centralus"
}

variable "app_name" {
  type        = string
  description = "App name prefix, used for Azure resource names"
}

variable "db_username" {
  type        = string
  description = "PostgreSQL admin username"
  default     = "pgadmin"
}

variable "db_password" {
  type        = string
  description = "PostgreSQL admin password"
  sensitive   = true
}

variable "acr_admin_enabled" {
  type        = bool
  description = "Enable admin user on the Azure Container Registry"
  default     = true
}

# Ensure the resource group exists
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

# Enable resource providers (usually not needed if you use portal or CLI, but explicit here)
resource "azurerm_resource_provider_registration" "web" {
  provider_namespace = "Microsoft.Web"
  depends_on         = [azurerm_resource_group.rg]
}

resource "azurerm_resource_provider_registration" "acr" {
  provider_namespace = "Microsoft.ContainerRegistry"
  depends_on         = [azurerm_resource_group.rg]
}

resource "azurerm_resource_provider_registration" "postgres" {
  provider_namespace = "Microsoft.DBforPostgreSQL"
  depends_on         = [azurerm_resource_group.rg]
}

# Create Azure Container Registry for Docker images
resource "azurerm_container_registry" "acr" {
  name                = "${var.app_name}acr"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = var.acr_admin_enabled
}

# Create Azure Database for PostgreSQL server
resource "azurerm_postgresql_server" "postgres_server" {
  name                = "${var.app_name}-psql-server"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  administrator_login          = var.db_username
  administrator_login_password = var.db_password
  version                     = "15" # PostgreSQL version 15
  sku_name                    = "B_Gen5_1" # Basic tier with 1 vCore

  storage_mb = 5120
  backup_retention_days = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled = true
  public_network_access_enabled = true

  ssl_enforcement_enabled = true
}

# Create a database in the PostgreSQL server
resource "azurerm_postgresql_database" "app_db" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.rg.name
  server_name         = azurerm_postgresql_server.postgres_server.name

  charset   = "UTF8"
  collation = "English_United States.1252"
}

# Create App Service Plan (Linux kind, using containers)
resource "azurerm_app_service_plan" "asp" {
  name                = "${var.app_name}-asp"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  kind = "Linux"

  sku {
    tier = "Basic"
    size = "B1"
  }

  reserved = true # Required for Linux plans
}

# Web App for Containers - using the image from ACR
resource "azurerm_web_app" "webapp" {
  name                = "${var.app_name}-webapp"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.asp.id

  site_config {
    linux_fx_version = "DOCKER|${azurerm_container_registry.acr.login_server}/${var.app_name}:latest"

    app_command_line = "" # optional, if container needs startup command

    acr_use_managed_identity = false   # We'll use admin user instead
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_REGISTRY_SERVER_URL"          = "https://${azurerm_container_registry.acr.login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME"     = azurerm_container_registry.acr.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD"     = azurerm_container_registry.acr.admin_password

    # Your application environment variables (example: database connection string)
    # Construct the connection string for your app
    "DATABASE_URL" = "postgresql://${var.db_username}:${var.db_password}@${azurerm_postgresql_server.postgres_server.fqdn}:5432/${azurerm_postgresql_database.app_db.name}?sslmode=require"
    
    # Additional env vars like PORT, NODE_ENV, Firebase keys etc can be added here:
    # "PORT" = "8080"
    # "NODE_ENV" = "production"
    # "FIREBASE_PROJECT_ID" = ...
    # "FIREBASE_CLIENT_EMAIL" = ...
    # "FIREBASE_PRIVATE_KEY" = ...
    # "FIREBASE_DATABASE_URL" = ...
  }

  # Enable Always On to avoid cold starts
  https_only                  = true
  client_affinity_enabled     = false
  enable_automatic_tls        = true

  depends_on = [
    azurerm_container_registry.acr,
    azurerm_postgresql_server.postgres_server,
    azurerm_postgresql_database.app_db,
    azurerm_app_service_plan.asp
  ]
}

# Output the Web App URL
output "webapp_url" {
  value = "https://${azurerm_web_app.webapp.default_site_hostname}"
  description = "The public URL for the Azure Web App"
}

# Output the PostgreSQL server fully qualified domain name
output "postgresql_fqdn" {
  value       = azurerm_postgresql_server.postgres_server.fqdn
  description = "PostgreSQL Server FQDN"
}
