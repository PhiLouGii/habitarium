terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ECR Repository for storing Docker images
resource "aws_ecr_repository" "habitarium_repo" {
  name                 = "habitarium"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "habitarium_cluster" {
  name = "habitarium-cluster"
}

# VPC for our resources
resource "aws_vpc" "habitarium_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "habitarium-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "habitarium_igw" {
  vpc_id = aws_vpc.habitarium_vpc.id

  tags = {
    Name = "habitarium-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public_subnet_1" {
  vpc_id                  = aws_vpc.habitarium_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "habitarium-public-subnet-1"
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.habitarium_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "habitarium-public-subnet-2"
  }
}

# Route Table for public subnets
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.habitarium_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.habitarium_igw.id
  }

  tags = {
    Name = "habitarium-public-rt"
  }
}

# Associate route table with public subnets
resource "aws_route_table_association" "public_rta_1" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_rta_2" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_rt.id
}

# Security Group for Load Balancer
resource "aws_security_group" "alb_sg" {
  name_prefix = "habitarium-alb-"
  vpc_id      = aws_vpc.habitarium_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "habitarium-alb-sg"
  }
}

# Security Group for ECS Tasks
resource "aws_security_group" "ecs_sg" {
  name_prefix = "habitarium-ecs-"
  vpc_id      = aws_vpc.habitarium_vpc.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "habitarium-ecs-sg"
  }
}

# Application Load Balancer
resource "aws_lb" "habitarium_alb" {
  name               = "habitarium-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]

  enable_deletion_protection = false

  tags = {
    Name = "habitarium-alb"
  }
}

# ALB Target Group
resource "aws_lb_target_group" "habitarium_tg" {
  name        = "habitarium-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.habitarium_vpc.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }

  tags = {
    Name = "habitarium-tg"
  }
}

# ALB Listener
resource "aws_lb_listener" "habitarium_listener" {
  load_balancer_arn = aws_lb.habitarium_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.habitarium_tg.arn
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "habitarium_logs" {
  name              = "/ecs/habitarium"
  retention_in_days = 7
}

# IAM role for ECS tasks
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "habitarium-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "habitarium_task" {
  family                   = "habitarium"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "habitarium"
      image = "${aws_ecr_repository.habitarium_repo.repository_url}:latest"
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/habitarium"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# ECS Service
resource "aws_ecs_service" "habitarium_service" {
  name            = "habitarium-service"
  cluster         = aws_ecs_cluster.habitarium_cluster.id
  task_definition = aws_ecs_task_definition.habitarium_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_sg.id]
    subnets          = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.habitarium_tg.arn
    container_name   = "habitarium"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.habitarium_listener]
}