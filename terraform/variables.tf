variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
}

variable "resource_group_name" {
  description = "Azure Resource Group name"
  type        = string
}

variable "location" {
  description = "Azure Region (e.g., eastus, westus2)"
  type        = string
  default     = "eastus"
}

variable "app_name" {
  description = "Name prefix for Azure resources (e.g., app name)"
  type        = string
  default     = "my-app"
}

variable "db_password" {
  description = "Password for PostgreSQL database admin user"
  type        = string
  sensitive   = true
}
