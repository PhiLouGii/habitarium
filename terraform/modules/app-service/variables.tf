variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "ecr_repository_url" {
  type = string
}

variable "tags" {
  type = map(string)
}

variable "container_port" {
  type        = number
  description = "Port exposed by the container"
}

variable "health_check_path" {
  type        = string
  description = "Path for health check on the container"
}

variable "alb_security_group_id" {
  type        = string
  description = "Security group ID for the ALB"
}

