# Habitarium: Build Good, Break Bad
*Take control of your habits, build positive routines, and track your progress towards a better you.*

## 📖 Overview
Habitarium is a comprehensive web application designed to empower individuals in transforming their daily routines. It provides a dual-focus approach, assisting users in both kicking undesirable habits and forming healthy, positive ones. With Habitarium, you can meticulously track your journey, monitor "resistance days" for bad habits, celebrate "streaks" for good habits, and unlock rewarding "accomplishments" as you progress. Our goal is to provide a clear, motivating, and insightful platform for sustainable personal growth.

## ✨ Key Features
- **Secure authentication** - Robust user registration and login system with JWT-based security.
- **Dual-habit tracking** - Comprehensive system for building good habits and breaking bad ones. 
- **Streak visualisation** - Intuitive display of good habit streaks and resistance tracking for bad habits.
- **Daily habit logging** - Simple interface to log habit status (done/resisted/slipped).
- **Dashboard analytics** - Real-time insights into your progress and habit patterns.
- **Achievement system** - Gamified milestones and rewards for consistent effort and goal attainment. 

## 🏗️ Architecture & Technology Stack
Habitarium is built with a modern, scalable architecture, leveraging the following technologies:

### Backend Infrastructure
*   **Runtime**: Node.js with Express.js framework
*   **Language**: TypeScript
*   **Database**: Firebase Firestore
*   **Authentication**: JSON Web Tokens (JWT) for secure session management
*   **Security**: `bcryptjs` for advanced password hashing

### Frontend Experience
- Framework: React.js (v18)
- Build Tool: Vite
- Language: TypeScript
- Styling: CSS modules

### 🚀DevOps & Deployment
- Containerization: Docker is used for consistent development and deployment environments, leveraging efficient multi-stage builds to optimize image sizes and improve deployment speed and security.
- Infrastructure as Code (IaC): Terraform provisions and manages cloud infrastructure across AWS, Google Cloud Platform (GCP), and now Microsoft Azure, enabling reproducible and versioned deployments.
- CI/CD: GitHub Actions powers automated testing and deployment pipelines across platforms, facilitating streamlined continuous integration and continuous delivery workflows.
- Container Service Deployment:
- - Initially explored AWS App Runner for container hosting but faced credential and access challenges.
- - Successfully deployed containerized applications manually and via IaC to Microsoft Azure Web App for Containers, providing a stable production environment with Azure-managed scaling and monitoring.
- - Also maintain deployment on Render platform to complement cloud deployments, providing a simplified UI-based deployment option.

### 🧪Testing
*   **Backend**: Jest with Supertest for API integration testing.
*   **Frontend**: Vitest with React Testing Library and JSDOM for component testing.

## 🔐Security Remediation

### Vulnerability: Predictable Value Range from Previous Values (CVE-2022-24767)
- **Severity**: Critical
- **Affected Packages**: 
  - Frontend: form-data@4.0.3 (via axios)
  - Backend: form-data@2.5.3 (via firebase-admin)
- **Fix Applied**:
  ```bash
  # Frontend fix
  npm install form-data@4.0.4 --save
  
  # Backend fix
  npm install form-data@2.5.4 --save
  ```
- **Reference**: [Snyk Vulnerability DB](https://security.snyk.io/vuln/SNYK-JS-FORMDATA-10841150)

### Security Exceptions
### Vulnerability: Predictable Value Range from Previous Values (CVE-2022-24767)
- **Status**: Risk accepted
- **Reason**: No direct upgrade path for transitive dependency
- **Risk Assessment**: Low risk for our application as we don't use the vulnerable functionality
- **Policy Exception**: Added to `.snyk` policy file

## 🔧 Prerequisites
Ensure your development environment includes the following: 
| Technology | Version   | Purpose                                     |
|------------|-----------|---------------------------------------------|
| Node.js    | v18.0+    | JavaScript runtime                          |
| Firebase   | N/A       | Database system    |
| Git        | Latest    | Version control                             |
| npm        | Latest    | Package management     
| Docker      | Latest     | Containerization          |
| Terraform   | Latest     | Infrastructure as Code    |

## 🚀 Quick Start Guide (Docker-based)
Follow these steps to get Habitarium running quickly using Docker on your local machine.

### Step 1: Repository Setup
Clone the repository to your local machine and navigate into the project directory.
```bash
git clone https://github.com/PhiLouGii/habitarium.git
cd habitarium
```

### Step 2: Configure Environment Variables
Before building, ensure your environment variables are set.
*   **Firebase Credentials**: You'll need a `.env` file in the `backend/` directory with your Firebase service account credentials. Refer to the `.env.example` in `backend/` for required variables.
*   **Frontend API URL**: The frontend needs to know where to find the backend. Create a `.env` file in `frontend/` and set `VITE_API_BASE_URL` to point to your backend container (e.g., `http://localhost:3001/api`). Refer to the `.env.example` in `frontend/`.

### Step 3: Build and Run with Docker Compose
From the project root directory, use Docker Compose to build your images and launch the services. This will set up both backend and frontend containers, along with any necessary services (e.g., a local database if configured in `docker-compose.yml`).

```
docker-compose up-build
```
### Step 4: Access Application (Local Development)
- **Frontend Application:**  
  Available at http://localhost:5173 (or the port shown by Vite/Docker).
- **Backend API:**  
  Available at http://localhost:3001/api.

### Step 4: Access Application (Production Deployment)
- **Application URL:**   
  [https://habitarium-webapp.azurewebsites.net/](https://habitarium-webapp.azurewebsites.net/)
- **Backend API:**  
  Available at https://habitarium-webapp.azurewebsites.net/api

### Stopping the Application
To stop and remove the containers, networks, and volumes created by `docker-compose up`:

```docker-compose down```

## ☁️ Cloud Deployment
Habitarium’s infrastructure is defined and provisioned using Terraform, targeting cloud environments on AWS, Google Cloud Platform, and Microsoft Azure. While initial provisioning attempts faced platform-specific challenges (as detailed in phase.md), the containerised application has been successfully deployed on Microsoft Azure Web App for Containers, demonstrating the full containerization and manual deployment workflow on a major cloud platform.

### Live Public URL
**Application URL**: [https://habitarium-webapp.azurewebsites.net/](https://habitarium-webapp.azurewebsites.net/)

## Testing 🧪
Run automated tests for both your backend and frontend applications to ensure functionality and code quality.
### Backend Test Suite
```
cd backend
npm test
```
### Frontend Test Suite: 
```
cd frontend
npm test
```

## 📡 API Reference
The Habitarium backend exposes the following RESTful API endpoints. The base URL for all endpoints is http://localhost:3001/api.

| Method | Endpoint         | Description                                | Auth | Request Body (Example)                                                                 | Response (Success Example)                                                                                                                                                 |
|--------|------------------|--------------------------------------------|------|-----------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| POST   | `/habits/log`    | Logs a new habit entry for a user.         | None | `{ "userId": "user123", "name": "Drink Water", "date": "2025-07-01T10:00:00Z" }`        | `{ "_id": "60c72b2f9f1b2c001c8e4d5f", "userId": "user123", "name": "Drink Water", "date": "2025-07-01T10:00:00.000Z", "completed": true, "createdAt": "...", "updatedAt": "..." }` |
| GET    | `/habits/:userId`| Retrieves all habit entries for a user.    | None | _(None)_                                                                               | `[ { "_id": "...", "userId": "user123", "name": "Meditate", "date": "2025-06-30T08:00:00.000Z", ... }, { "_id": "...", "userId": "user123", "name": "Exercise", "date": "2025-07-01T07:00:00.000Z", ... } ]`     |

## 📁 Project Structure
The Habitarium project is organized into backend and frontend directories, with a dedicated .github folder for CI/CD workflows.
```
habitarium/
├── 📂 .github/ 
│ └── 📂 workflows/
│ └── ci.yml 
├── 📂 backend/ 
│ ├── 📂 models/
│ │ └── Habit.js
│ ├── 📂 routes/
│ │ └── habits.js 
│ ├── 📂 tests/
│ │ └── habits.test.js 
│ ├── Dockerfile
│ ├── server.js 
│ ├── package.json 
│ └── .env 
├── 📂 frontend/ 
│ ├── 📂 public/ 
│ ├── 📂 src/
│ │ ├── 📂 components/
│ │ │ ├── StreakCounter.tsx 
│ │ │ └── StreakCounter.css 
│ │ ├── 📂 assets/ 
│ │ ├── App.tsx 
│ │ ├── App.css 
│ │ ├── main.tsx 
│ │ └── setupTests.ts 
│ │ └── components/
│ │ └── StreakCounter.test.tsx 
│ ├── Dockerfile 
│ ├── package.json 
│ ├── vite.config.ts 
│ └── .env 
├── 📂 terraform/
│ └── main.tf 
│ └── variables.tf 
│ └── outputs.tf 
├── docker-compose.yml
├── Dockerfile
├── phase.md 
└── README.md 
```

## Project Status & Roadmap 🗺️

| Status | Feature / Milestone          | Description                                         |
|--------|------------------------------|-----------------------------------------------------|
| ✅     | Core Application Baseline     | Basic habit logging and streak counter UI.          |
| ✅     | CI Pipeline                   | Automated linting and unit tests on Pull Requests.  |
| ✅   | Containerization              | Docker implementation for consistent environments.  |
| ✅     | Infrastructure as Code (IaC)  | Automated infrastructure provisioning.              |
| ❔     | Continuous Deployment Pipeline| Automation for deploying to cloud environments.     |
| ❔     | Monitoring & Logging          | Application performance and error tracking.         |
| ✏️     | Achievement System            | Implementation of gamified milestones.              |
| ❔     | Habit Replacement Suggestions | AI-driven suggestions for replacing bad habits.     |

**Key:** ✅ Complete | ❔ In Progress | ✏️ Planned  

## 🤝 Contributing
Contributions from the community are welcome! Here's how to get involved:
1. Fork the repository to your GitHub account.
2. Clone your forked repository: git clone https://github.com/your-username/habitarium.git
3. Create a feature branch: git checkout -b feature/your-amazing-enhancement
4. Implement your changes with appropriate tests.
5. Validate all tests pass: npm test (in both backend and frontend directories).
6. Commit with descriptive messages: git commit -m 'feat: Add amazing new feature' (or fix:, chore:, etc.).
7. Push to your branch: git push origin feature/your-amazing-enhancement
8. Submit a Pull Request to the develop branch of the main repository with a detailed description of your changes.

Made with ❤️ for better habits.
Star ⭐ this repository if you find it helpful!

Test CI/CD pipeline trigger.
