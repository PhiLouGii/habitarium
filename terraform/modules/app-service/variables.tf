variable "project_name" {
  type        = string
  description = "Name of the project"
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
  type    = map(string)
  default = {}
}
