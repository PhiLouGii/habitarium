output "frontend_ecr_repository_url" {
  description = "Frontend ECR repository URL"
  value = aws_ecr_repository.frontend.repository_url
}

output "backend_ecr_repository_url" {
  description = "Backend ECR repository URL"
  value = aws_ecr_repository.backend.repository_url
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

output "aws_account_id" {
  description = "AWS Account ID"
  value       = data.aws_caller_identity.current.account_id
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "deployment_instructions" {
  description = "Next steps for deployment"
  value = <<-EOT
    1. Build and push Docker images:
       - Frontend: ${aws_ecr_repository.frontend.repository_url}
       - Backend: ${aws_ecr_repository.backend.repository_url}
    
    2. Create App Runner services using the AWS console or CLI
    
    3. Use the IAM role: ${aws_iam_role.app_runner_access.arn}
    
    4. Your ECR login command:
       aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com
  EOT
}