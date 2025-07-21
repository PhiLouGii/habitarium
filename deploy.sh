#!/bin/bash

set -e

echo "🚀 Starting Habitarium deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if required tools are installed
command -v aws >/dev/null 2>&1 || { echo -e "${RED}AWS CLI is required but not installed.${NC}" >&2; exit 1; }
command -v terraform >/dev/null 2>&1 || { echo -e "${RED}Terraform is required but not installed.${NC}" >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Docker is required but not installed.${NC}" >&2; exit 1; }

# Get AWS region and account ID
AWS_REGION=$(aws configure get region)
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo -e "${YELLOW}Using AWS Account: ${AWS_ACCOUNT_ID}${NC}"
echo -e "${YELLOW}Using AWS Region: ${AWS_REGION}${NC}"

# Step 1: Apply Terraform infrastructure
echo -e "${GREEN}📦 Applying Terraform infrastructure...${NC}"
cd terraform
terraform init
terraform plan
terraform apply -auto-approve

# Get ECR URLs
FRONTEND_ECR=$(terraform output -raw ecr_frontend_url)
BACKEND_ECR=$(terraform output -raw ecr_backend_url)

cd ..

echo -e "${GREEN}🔧 Infrastructure deployed successfully!${NC}"

# Step 2: Build and push Docker images
echo -e "${GREEN}🐳 Building and pushing Docker images...${NC}"

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push backend
echo -e "${YELLOW}Building backend image...${NC}"
docker build -t habitarium-backend ./backend
docker tag habitarium-backend:latest $BACKEND_ECR:latest
docker push $BACKEND_ECR:latest

# Build and push frontend  
echo -e "${YELLOW}Building frontend image...${NC}"
docker build -t habitarium-frontend ./frontend
docker tag habitarium-frontend:latest $FRONTEND_ECR:latest
docker push $FRONTEND_ECR:latest

echo -e "${GREEN}✅ Docker images pushed successfully!${NC}"

# Step 3: Display next steps
echo -e "${GREEN}🎉 Infrastructure and images are ready!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Go to AWS App Runner console"
echo "2. Create backend service:"
echo "   - Image: $BACKEND_ECR:latest"
echo "   - Port: 3001"
echo "3. Create frontend service:"
echo "   - Image: $FRONTEND_ECR:latest" 
echo "   - Port: 80"
echo "4. Configure environment variables in App Runner"

echo -e "${GREEN}🚀 Deployment preparation complete!${NC}"