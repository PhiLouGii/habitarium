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

Backend Infrastructure
- Runtime: Node.js with Express.js framework
- Language: TypeScript
- Database: Firebase Firestore
- Authentication: JSON Web Tokens (JWT) for secure session management (Planned)
- Security: bcryptjs for advanced password hashing (Planned)

Frontend Experience
- Framework: React.js (v18)
- Build Tool: Vite
- Language: TypeScript
- Styling: CSS modules

DevOps & Deployment
- Containerization: Docker for consistent development and deployment environments (Planned)
- CI/CD: GitHub Actions for automated testing and deployment pipelines
- Cloud Infrastructure: AWS deployment architecture (in development)

Testing
- Backend: Jest with Supertest for API integration testing.
- Frontend: Vitest with React Testing Library and JSDOM for component testing.

## 🔧 Prerequisites
Ensure your development environment includes the following: 
| Technology | Version   | Purpose                                     |
|------------|-----------|---------------------------------------------|
| Node.js    | v18.0+    | JavaScript runtime                          |
| Firebase   | N/A       | Database system    |
| Git        | Latest    | Version control                             |
| npm        | Latest    | Package management     

## 🚀 Quick Start Guide
Follow these steps to get Habitarium running on your local machine

### Step 1: Repository Setup
Clone the repository to your local machine and navigate into the project directory.
```bash
git clone https://github.com/PhiLouGii/habitarium.git
cd habitarium
```

### Step 2: Backend Configuration
Navigate to the backend directory, install dependencies, and configure environment variables.
```
cd backend
npm install
```
Create a ```.env``` file by adding it with your Firebase credentials:
```

```
### Open the newly created ```.env``` file and update the following variables:
```

```
### Start the backend development server: 
```
npm run dev
```
🌐 **Backend API available at:** http://localhost:3001

### Step 3: Frontend Setup
Open a new terminal window, navigate back to the project root, then into the frontend directory, install dependencies, and configure environment variables.
```
cd ../frontend
npm install
```
Create a ```.env``` file by copying the example and then edit it to point to your backend API:
```
cp .env.example .env
```
### Open the newly created ```.env``` file and update the following variable:
```
VITE_API_BASE_URL=http://localhost:3001/api
```
### Launch the frontend development server: 
```
npm run dev
```
🎨 **Frontend application available at:** http://localhost:5173 (or the port shown by Vite)

### Step 4: Access Application
Once both backend and frontend servers are running, access the application in your web browser:
- Frontend: http://localhost:3000
- Backned API: http://localhost:3001/api

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
├── 📂 .github/                 # GitHub Actions workflows
│   └── 📂 workflows/
│       └── ci.yml             # CI Pipeline definition
├── 📂 backend/                 # Node.js/Express.js server-side application
│   ├── 📂 models/
│   │   └── Habit.js           
│   ├── 📂 routes/
│   │   └── habits.js          # API routes for habit management
│   ├── 📂 tests/
│   │   └── habits.test.js     # Backend unit/integration tests
│   ├── server.js              # Express server entry point
│   ├── package.json           # Backend dependencies & scripts
│   └── .env                   # Environment variables (local, ignored by Git)
├── 📂 frontend/               # React.js/Vite client-side application
│   ├── 📂 public/             # Static assets
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── StreakCounter.tsx  # Component to display habit streaks
│   │   │   └── StreakCounter.css  # Styling for StreakCounter
│   │   ├── 📂 assets/         # Static assets like logos
│   │   ├── App.tsx            # Root application component
│   │   ├── App.css            # Global styles
│   │   ├── main.tsx           # Application entry point
│   │   └── setupTests.ts      # Frontend test setup (e.g., Jest-DOM)
│   │   └── components/
│   │       └── StreakCounter.test.tsx # Frontend component tests
│   ├── package.json           # Frontend dependencies & scripts
│   ├── vite.config.ts         # Vite and Vitest configuration
│   └── .env                   # Environment variables (local, ignored by Git)
└── README.md                  # Project documentation
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
