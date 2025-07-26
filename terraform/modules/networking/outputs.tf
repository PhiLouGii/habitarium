output "vnet_id" {
  description = "The ID of the Azure Virtual Network"
  value       = azurerm_virtual_network.vnet.id
}

output "public_subnet_ids" {
  description = "IDs of public subnets in Azure"
  value       = azurerm_subnet.public[*].id
}

output "alb_network_security_group_id" {
  description = "Network Security Group ID for the Application Gateway (ALB equivalent)"
  value       = azurerm_network_security_group.alb_nsg.id
}

output "service_network_security_group_id" {
  description = "Network Security Group ID for backend service containers"
  value       = azurerm_network_security_group.service_nsg.id
}
