variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "habitarium"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "tags" {
  type = map(string)
  default = {}
}

variable "frontend_repository_name" {
  type    = string
  default = "habitarium-frontend"
}

variable "backend_repository_name" {
  type    = string
  default = "habitarium-backend"
}

variable "domain_name" {
  type        = string
  description = "The domain name for the application"
}


variable "firebase_project_id" {
  type        = string
  description = "Firebase Project ID"
}

variable "firebase_private_key" {
  type        = string
  sensitive   = true
  description = "Firebase Private Key"
}

variable "firebase_client_email" {
  type        = string
  description = "Firebase client email"
}
