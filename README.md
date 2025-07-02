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
- Database: MongoDB (via MongoDB Atlas for cloud, Mongoose ODM)
- Authentication: JSON Web Tokens (JWT) for secure session management (Planned)
- Security: bcryptjs for advanced password hashing (Planned)

Frontend Experience
- Framework: React.js (v18)
- Build Tool: Vite
- Language: TypeScript
- Styling: Vanilla CSS for utility-first styling and responsive design
- HTTP Client: Fetch API (or Axios for future enhancements)

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
| MongoDB    | N/A       | Database system (Atlas account or local)    |
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
