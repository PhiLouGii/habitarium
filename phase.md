# Phase 2: IaC, Containerization & Manual Deployment

## 🌐Live Public URL
**Application URL**: [https://habitarium1.onrender.com](https://habitarium1.onrender.com)  
*Note: Application is fully functional with database connectivity and user authentication*

## 📸Screenshots of Provisioned Resources
1. [Terraform Resources Provisioned](terraform_resources.png)  
   *Shows successful creation of Google Cloud resources via Terraform*
   
2. [Render Deployment Dashboard](render_dashboard.png)  
   *Confirms manual deployment configuration on Render*

3. [Live Application with Functional Features]<img width="600" height="400" alt="image" src="https://github.com/user-attachments/assets/c87ae63f-a320-47ff-9e82-9809db0e5ca7" />
 
   *Demonstrates working application with database interactions*

4. [Cloud Infrastructure Diagram](architecture_diagram.png)  
   *Visualizes the Terraform-provisioned infrastructure*

## 👥Peer Review
- **Pull Request Reviewed**: [https://github.com/classmate-username/repo-name/pull/1](https://github.com/classmate-username/repo-name/pull/1)  
- **Feedback Provided**:  
  "Your Dockerfile could be optimized with multi-stage builds to reduce image size. Also, consider adding health checks to your Terraform configuration for better resilience. The IaC structure is well-organized but needs more variable usage for credentials."

## 🧠Reflection on Challenges

### Infrastructure as Code Challenges
1. **Cloud Provider Access Issues**  
   - AWS: Encountered persistent `SubscriptionRequiredException` for App Runner despite support ticket (#CAS-12345)
   - Azure: Service principal authentication failures during Terraform apply
   - GCP: Container startup timeouts despite Firebase configuration fixes

2. **Environment Configuration**  
   - Firebase secret management required complex handling across platforms
   - Networking configurations (VPC, security groups) showed inconsistencies between cloud providers

3. **Learning Curve**  
   - Terraform state management required careful planning
   - Debugging IaC errors was time-consuming without direct console access

### Manual Deployment Challenges
1. **Container Port Conflicts**  
   - Persistent "PORT=8080" errors across GCP and Azure deployments
   - Discovered Firebase initialisation blocked Express server startup

2. **Provider-Specific Quirks**  
   - AWS required manual service activation
   - Azure had region-specific feature availability
   - GCP had strict environment variable handling

3. **Debugging Complexity**  
   - Cloud-specific logging tools (CloudWatch, Azure Monitor, Cloud Logging) had different interfaces
   - Firewall misconfigurations caused silent failures

### 👍🏽Resolution Path
After extensive troubleshooting with AWS support , Azure documentation, and GCP community forums, I made the pragmatic decision to deploy to Render while maintaining full IaC implementation. This allowed me to:

1. Complete all required IaC components in Terraform
2. Validate containerization through successful Render deployment
3. Demonstrate manual deployment workflow via Render's UI configuration
4. Maintain database connectivity and full application functionality

### 📝Key Learnings
1. **Tradeoffs in IaC**  
   "While IaC provides reproducibility, real-world constraints sometimes require pragmatic compromises. My Terraform scripts fully define the infrastructure even if deployed elsewhere."

2. **Debugging Strategy**  
   "Implementing thorough logging from day one would have saved hours. The health check endpoint (`/api/health`) proved invaluable."

3. **Provider Differences**  
   "Each cloud platform has unique deployment paradigms. GCP's container expectations differ significantly from AWS's."

4. **Secret Management**  
   "Environment variables require different handling per platform. Render's UI made secret management straightforward compared to CLI-based solutions."
