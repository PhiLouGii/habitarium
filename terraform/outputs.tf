output "vpc_id" {
  description = "ID of the VPC"
  value       = module.networking.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.networking.public_subnet_ids
}

output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = module.container_registry.repository_url
}

output "application_load_balancer_dns" {
  description = "DNS name of the Application Load Balancer"
  value       = module.app_service.alb_dns_name
}

output "application_url" {
  description = "Public URL of the deployed application"
  value       = "http://${module.app_service.alb_dns_name}"
}