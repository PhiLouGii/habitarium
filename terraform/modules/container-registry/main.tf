variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
  default = "eastus"
}

variable "frontend_registry_name" {
  type = string
}

variable "backend_registry_name" {
  type = string
}

# Resource Group (ensure it exists)
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

# Frontend Container Registry
resource "azurerm_container_registry" "frontend" {
  name                = var.frontend_registry_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true # Optional: enable for admin credentials

  tags = merge({
    Project     = var.project_name
    Environment = var.environment
  }, var.tags)
}

# Backend Container Registry
resource "azurerm_container_registry" "backend" {
  name                = var.backend_registry_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = merge({
    Project     = var.project_name
    Environment = var.environment
  }, var.tags)
}

# Retention Policy on Frontend Registry - clean up deleted manifests after 7 days
resource "azurerm_container_registry_retention_policy" "frontend" {
  registry_name      = azurerm_container_registry.frontend.name
  resource_group_name = azurerm_resource_group.rg.name

  days    = 7
  status  = "Enabled"
  type    = "Delete"
}

# Retention Policy on Backend Registry - same cleanup
resource "azurerm_container_registry_retention_policy" "backend" {
  registry_name      = azurerm_container_registry.backend.name
  resource_group_name = azurerm_resource_group.rg.name

  days    = 7
  status  = "Enabled"
  type    = "Delete"
}
