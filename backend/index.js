const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');

// Load environment variables ASAP
dotenv.config();

// Import the Firebase instances (updated to match new export structure)
const { admin, auth, db } = require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 8080;

console.log("🕒 Starting server initialization...");
console.log("Environment variables:", {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_DATABASE_URL: !!process.env.FIREBASE_DATABASE_URL
});

// db is already initialized from the firebase.js import
console.log("✅ Firestore connected");

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve frontend build static files
app.use(express.static(path.join(__dirname, 'public')));

// Fixed catch-all route - added 'next' parameter and fixed logic
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// General error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(error.status || 500).json({
    error: error.status === 404 ? 'Route not found' : 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});