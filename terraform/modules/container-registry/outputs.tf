output "repository_url" {
  description = "The ECR repository URL"
  value       = aws_ecr_repository.main.repository_url
}
