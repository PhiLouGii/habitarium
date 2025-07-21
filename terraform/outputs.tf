output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.habitarium_repo.repository_url
}

output "load_balancer_dns" {
  description = "DNS name of the load balancer"
  value       = aws_lb.habitarium_alb.dns_name
}

output "application_url" {
  description = "Public URL of the application"
  value       = "http://${aws_lb.habitarium_alb.dns_name}"
}

output "cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.habitarium_cluster.name
}

output "service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.habitarium_service.name
}