# Habitarium: Build Good, Break Bad
A dual-focus habit tracker that assists users in kicking bad habits and forming healthy ones. As you change your daily behaviours, you can track resistance days for bad habits, streaks for good habits, and unlock accomplishments.

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
| **Frontend**      | React 18, TypeScript, Vite          |
| **Backend**       | Node.js, Express, TypeScript, MongoDB |
| **DevOps**        | GitHub Actions, Docker  |
| **Testing**       | Vitest, React Testing Library, Supertest |

## Local Setup 💻
Follow these steps to get Habitarium up and running on your local machine for development.

### Prerequisites
Ensure you have the following installed:
- Node.js: Version 18+ (LTS recommended)
- MongoDB Atlas account or a local MongoDB instance running
- Git

### 1. Clone Repository
First, clone the Habitarium repository to your local machine and navigate into the project directory:
```bash
git clone https://github.com/PhiLouGii/habitarium.git
cd habitarium
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure environment variables.
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
**Important:** Replace <your_username> and <your_password> with your MongoDB Atlas credentials. Ensure JWT_SECRET is a long, random string.

### Start the backend server: 
```
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate back to the project root, then into the frontend directory, install dependencies, and configure environment variables.
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
This project utilises a GitHub Project Board for agile project management. The board tracks work items from Backlog, through To Do, In Progress, Review, and Done. 

## CI/CD Pipeline 🔄
My Continuous Integration (CI) pipeline, powered by GitHub Actions, ensures code quality and reliability:   
1. Runs on every push and pull request
2. Executes linting checks to maintain code style and catch potential errors.
3. Runs unit tests for both frontend and backend services.
4. Enforces code quality by requiring status checks before merging Pull Requests. 

## Roadmap 🗺️
Future development phases for Habitarium include: 
1. Containerization with Docker
2. Infrastructure as Code (IaC) setup
3. Continuous Deployment pipeline
4. Achievement system implementation
5. Habit replacement suggestions
