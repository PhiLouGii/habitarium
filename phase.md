# Phase Submission: Manual Deployment & Infrastructure as Code (IaC)

## ✅ Live Public URL of Manually Deployed App

[https://your-app-url.com](https://your-app-url.com)  
_This is the public URL of the app I manually deployed using Docker and cloud infrastructure provisioned with Terraform._

---

## 📸 Screenshots of Provisioned Resources

### 1. Container Registry (ECR/ACR)
![ECR screenshot](./screenshots/ecr.png)

### 2. App Runner / Container Service
![App Runner screenshot](./screenshots/apprunner.png)

### 3. Terraform Output in Terminal
![Terraform deploy](./screenshots/terraform-output.png)

> _All screenshots are located in the `/screenshots` folder in this repo._

---

## 🔁 Pull Request Reviewed

I reviewed the following peer's pull request:  
[https://github.com/peer-username/project-name/pull/XX](https://github.com/peer-username/project-name/pull/XX)

---

## 🧠 Reflection: Challenges of IaC and Manual Deployment

This phase helped me gain a deeper understanding of how cloud infrastructure and deployment pipelines work under the hood. Here are a few key takeaways:

- **Terraform** was powerful, but error-prone without careful planning. Debugging resource names, regions, and IAM permissions was tricky at first.
- Creating a Docker image and pushing it to a container registry (like AWS ECR or Azure ACR) was new for me, but very educational.
- Configuring a container service manually (like App Runner) taught me how routing, ports, and environment variables all connect to running a live app.
- It made me appreciate **CI/CD tools** more — because the manual process, while educational, is much slower than automated pipelines.

Overall, this process clarified the full lifecycle from code → container → cloud infrastructure → running app.

---

