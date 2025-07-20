output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.your_vpc_resource.id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = aws_subnet.public[*].id
}
