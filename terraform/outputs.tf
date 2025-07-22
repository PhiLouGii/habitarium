output "frontend_ecr_repository_url" {
  value = module.container_registry.frontend_repository_url
}

output "backend_ecr_repository_url" {
  value = module.container_registry.backend_repository_url
}

output "ecr_repository_url" {
  description = "ECR repository URL from container registry module"
  value = module.container_registry.repository_url
}


output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "app_runner_role_arn" {
  description = "ARN of the App Runner access role"
  value       = aws_iam_role.app_runner_access.arn
}

output "deployment_instructions" {
  description = "Next steps for deployment"
  value = <<-EOT
    1. Build and push Docker images:
       - Frontend: ${aws_ecr_repository.frontend.repository_url}
       - Backend: ${aws_ecr_repository.backend.repository_url}
    
    2. Create App Runner services using the AWS console or CLI
    
    3. Use the IAM role: ${aws_iam_role.app_runner_access.arn}
  EOT
}