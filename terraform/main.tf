terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

# Local values for common tags
locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    Owner       = var.owner
    CreatedBy   = "terraform"
  }
}

# Networking module
module "networking" {
  source = "./modules/networking"
  
  project_name        = var.project_name
  environment         = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = data.aws_availability_zones.available.names
  
  tags = local.common_tags
}

# Container Registry module
module "container_registry" {
  source = "./modules/container-registry"
  
  project_name = var.project_name
  environment  = var.environment
  
  tags = local.common_tags
}

# App Service module
module "app_service" {
  source = "./modules/app-service"
  
  container_port        = 3000 
  health_check_path     = "/health"
  alb_security_group_id = var.alb_security_group_id

  project_name          = var.project_name
  environment           = var.environment
  ecr_repository_url    = module.container_registry.repository_url
  vpc_id                = module.networking.vpc_id
  public_subnet_ids     = module.networking.public_subnet_ids
  ecs_security_group_id = var.ecs_security_group_id
  
  tags                  = local.common_tags
}