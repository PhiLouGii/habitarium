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
  type    = map(string)
  default = {}
}

variable "address_space" {
  type    = list(string)
  default = ["10.0.0.0/16"]  # similar to your VPC CIDR
}

variable "subnet_prefixes" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]  # similar to public subnets cidrblocks
}

# 1. Resource Group (create or use existing)
resource "azurerm_resource_group" "rg" {
  name     = "${var.project_name}-${var.environment}-rg"
  location = var.location
  tags     = var.tags
}

# 2. Virtual Network
resource "azurerm_virtual_network" "vnet" {
  name                = "${var.project_name}-${var.environment}-vnet"
  address_space       = var.address_space
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  tags                = var.tags
}

# 3. Subnets
resource "azurerm_subnet" "public" {
  count               = length(var.subnet_prefixes)
  name                = "${var.project_name}-${var.environment}-public-subnet-${count.index + 1}"
  resource_group_name = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = [var.subnet_prefixes[count.index]]

  # Enable service endpoints or NSG for security as needed
}

# 4. Internet Gateway Equivalent: Azure uses "Internet" routing by default
# No explicit Internet Gateway resource is needed.

# 5. Route Table
resource "azurerm_route_table" "public_rt" {
  name                = "${var.project_name}-${var.environment}-public-rt"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  tags                = var.tags
}

# 6. Route to internet (default 0.0.0.0/0 via Internet)
resource "azurerm_route" "default_internet_route" {
  name                   = "default-route"
  resource_group_name    = azurerm_resource_group.rg.name
  route_table_name       = azurerm_route_table.public_rt.name
  address_prefix         = "0.0.0.0/0"
  next_hop_type          = "Internet"
}

# 7. Associate Route Table to Subnets
resource "azurerm_subnet_route_table_association" "assoc" {
  count              = length(azurerm_subnet.public)
  subnet_id          = azurerm_subnet.public[count.index].id
  route_table_id     = azurerm_route_table.public_rt.id
}

# 8. Network Security Group for ALB equivalent (Azure Application Gateway or Load Balancer)
resource "azurerm_network_security_group" "alb_nsg" {
  name                = "${var.project_name}-${var.environment}-alb-nsg"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  tags                = var.tags

  security_rule {
    name                       = "AllowHTTPInBound"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  security_rule {
    name                       = "AllowAllOutbound"
    priority                   = 200
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

# 9. Network Security Group for ECS Tasks / Backend services (allow inbound only from ALB NSG)
resource "azurerm_network_security_group" "service_nsg" {
  name                = "${var.project_name}-${var.environment}-service-nsg"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  tags                = var.tags

  security_rule {
    name                       = "AllowFromALB"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3001"
    source_address_prefix      = azurerm_network_security_group.alb_nsg.id
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowAllOutbound"
    priority                   = 200
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

# 10. Associate NSGs with Subnets
resource "azurerm_subnet_network_security_group_association" "alb_nsg_assoc" {
  count               = length(azurerm_subnet.public)
  subnet_id           = azurerm_subnet.public[count.index].id
  network_security_group_id = azurerm_network_security_group.alb_nsg.id
}
