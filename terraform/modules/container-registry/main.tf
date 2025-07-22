variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "tags" {
  type = map(string)
  default = {}
}

variable "frontend_repository_name" {
  type = string
}

variable "backend_repository_name" {
  type = string
}

resource "aws_ecr_repository" "frontend" {
  name = var.frontend_repository_name

  image_tag_mutability = "MUTABLE"

  tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
    },
    var.tags
  )
}

resource "aws_ecr_repository" "backend" {
  name = var.backend_repository_name

  image_tag_mutability = "MUTABLE"

  tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
    },
    var.tags
  )
}


# ECR Lifecycle Policy
resource "aws_ecr_lifecycle_policy" "main" {
  repository = aws_ecr_repository.main.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}