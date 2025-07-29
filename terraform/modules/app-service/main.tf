terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "location" {
  type    = string
  default = "eastus"
}

variable "tags" {
  type = map(string)
}

variable "container_image" {
  type = string
}

variable "container_port" {
  type    = number
  default = 8080
}

variable "app_gateway_subnet_id" {
  type = string
}

variable "vnet_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "app_service_subnet_id" {
  type = string
}

variable "log_analytics_workspace_id" {
  type = string
}

variable "log_analytics_workspace_key" {
  type      = string
  sensitive = true
}

# ---------
# Azure Container Registry
resource "azurerm_container_registry" "acr" {
  name                = "${var.project_name}${var.environment}acr"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Basic"
  admin_enabled       = true

  tags = var.tags
}

# ---------
# Resource Group 
resource "azurerm_resource_group" "rg" {
  name     = "${var.project_name}-${var.environment}-rg"
  location = var.location
  tags     = var.tags
}

# ---------
# Log Analytics Workspace for logs & monitoring
resource "azurerm_log_analytics_workspace" "law" {
  name                = "${var.project_name}-${var.environment}-law"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = var.tags
}

# ---------
# App Service Plan (Linux Containers)
resource "azurerm_app_service_plan" "asp" {
  name                = "${var.project_name}-${var.environment}-asp"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  kind = "Linux"
  reserved = true

  sku {
    tier = "Basic"
    size = "B1"
  }

  tags = var.tags
}

# ---------
# Web App for Container (similar to ECS task running container)
resource "azurerm_web_app" "webapp" {
  name                = "${var.project_name}-${var.environment}-webapp"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.asp.id

  site_config {
    linux_fx_version = "DOCKER|${var.container_image}"
    app_command_line = "" # optional start command
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_REGISTRY_SERVER_URL"          = "https://${azurerm_container_registry.acr.login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME"     = azurerm_container_registry.acr.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD"     = azurerm_container_registry.acr.admin_password

    # Add your app-specific environment variables here
    "PORT"                               = tostring(var.container_port)
    # Add others as needed, e.g. health check path vars, Firebase creds, etc.
  }

  identity {
    type = "SystemAssigned"
  }

  logs {
    application_logs {
      azure_blob_storage {
        level = "Information"
      }
    }
    http_logs {
      file_system {
        retention_in_mb   = 100
        retention_in_days = 7
      }
    }
  }

  depends_on = [
    azurerm_container_registry.acr,
    azurerm_app_service_plan.asp
  ]

  tags = var.tags
}

# ---------
# Application Gateway (similar to ALB)
resource "azurerm_application_gateway" "appgw" {
  name                = "${var.project_name}-${var.environment}-appgw"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku {
    name     = "Standard_v2"
    tier     = "Standard_v2"
    capacity = 2
  }

  gateway_ip_configuration {
    name      = "appgw-ip-configuration"
    subnet_id = var.app_gateway_subnet_id
  }

  frontend_port {
    name = "http-port"
    port = 80
  }

  frontend_ip_configuration {
    name                 = "public-ip-config"
    public_ip_address_id = azurerm_public_ip.appgw_public_ip.id
  }

  backend_address_pool {
    name = "webapp-pool"
    fqdns = [
      azurerm_web_app.webapp.default_site_hostname
    ]
  }

  backend_http_settings {
    name                  = "http-settings"
    cookie_based_affinity = "Disabled"
    port                  = var.container_port
    protocol              = "Http"
    host_name             = azurerm_web_app.webapp.default_site_hostname
    pick_host_name_from_backend_address = true
    probe_enabled         = true
    probe_name            = "health-probe"
  }

  probe {
    name                = "health-probe"
    protocol            = "Http"
    path                = "/health" # customize as per your app
    interval            = 30
    timeout             = 30
    unhealthy_threshold = 3
    match {
      body          = ""
      status_codes  = ["200-399"]
    }
  }

  listener {
    name                           = "http-listener"
    frontend_ip_configuration_name = "public-ip-config"
    frontend_port_name             = "http-port"
    protocol                       = "Http"
  }

  request_routing_rule {
    name                       = "routing-rule"
    rule_type                  = "Basic"
    http_listener_name         = "http-listener"
    backend_address_pool_name  = "webapp-pool"
    backend_http_settings_name = "http-settings"
  }

  tags = var.tags
}

# ---------
# Public IP for Application Gateway
resource "azurerm_public_ip" "appgw_public_ip" {
  name                = "${var.project_name}-${var.environment}-appgw-pip"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = var.tags
}

# ---------
# Application Insights for monitoring (optional)
resource "azurerm_application_insights" "app_insights" {
  name                = "${var.project_name}-${var.environment}-appinsights"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"

  retention_in_days = 30

  tags = var.tags
}

# ---------
# Outputs
output "web_app_url" {
  description = "Web App public URL"
  value       = "https://${azurerm_web_app.webapp.default_site_hostname}"
}

output "application_gateway_public_ip" {
  description = "Public IP of the Application Gateway"
  value       = azurerm_public_ip.appgw_public_ip.ip_address
}

