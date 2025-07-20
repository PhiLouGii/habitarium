variable "project_name" {
  type        = string
  description = "Project name"
}

variable "environment" {
  type        = string
  description = "Environment type (dev, prod, etc.)"
}

variable "tags" {
  type        = map(string)
  default     = {}
  description = "Tags for resources"
}
