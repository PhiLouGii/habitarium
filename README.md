# Habitarium: Build Good, Break Bad
A dual-focus habit tracker that assists users in kicking bad habits and forming healthy ones. As you change your daily behaviours, you can track resistance days for bad habits, streaks for good habits, and unlock accomplishments.

## CI Status
[![Node.js CI](https://github.com/PhiLouGii/habitarium/actions/workflows/ci.yml/badge.svg)](https://github.com/PhiLouGii/habitarium/actions/workflows/ci.yml)

## Features ✨
- **User authentication** with secure JWT tokens
- **Dual-habit tracking** building good habits and breaking bad habits
- **Streak visualization** with resistance tracking
- **Daily habit logging** (done/resisted/slipped)
- **Dashboard analytics** with progress insights
- **Achievement system** for milestone celebrations

## Tech Stack 🛠️
| Area              | Technologies                          |
|-------------------|---------------------------------------|
| **Frontend**      | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend**       | Node.js, Express, TypeScript, MongoDB |
| **DevOps**        | GitHub Actions, Docker  |
| **Testing**       | Vitest, React Testing Library, Supertest |

## Local Setup 💻

### Prerequisites
- Node.js v18+
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone Repository
```bash
git clone https://github.com/PhiLouGii/habitarium.git
cd habitarium
```

### 2. Backend Setup
```
cd backend
npm install
cp .env.example .env
```
### Edit ```.env``` with your MongoDB credentials: 
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/habitarium
JWT_SECRET=your_secure_secret_here
PORT=3001
```
### Start the backend: 
```
npm run dev
```

### 3. Frontend Setup
```
cd ../frontend
npm install
cp .env.example .env
```
### Edit ```.env```
```
VITE_API_BASE_URL=http://localhost:3001/api
```
### Start the frontend: 
```
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backned API: http://localhost:3001/api

## Testing 🧪
### Run backend tests: 
```
cd backend
npm test
```
### Run frontend tests: 
```
cd frontend
npm test
```

## Project Management 📊

## CI/CD Pipeline 🔄
My GitHub Actions pipeline: 
1. Runs on every push and pull request
2. Executes linting chekcs
3. Runs unit tests for both frontend and backend
4. Enforces code quality before merging

## Roadmap 🗺️
1. Containerization with Docker
2. Infrastructure as Code (IaC) setup
3. Continuous Deployment pipeline
4. Achievement system implementation
5. Habit replacement suggestions
