const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');

// Load env variables ASAP
dotenv.config();

// Initialize app
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

// Firebase Admin Setup
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://habitarium-d1aab-default-rtdb.firebaseio.com",
    storageBucket: "habitarium-d1aab.appspot.com"
  });
  console.log("✅ Firebase initialized");
} catch (error) {
  console.error("🔥 Firebase initialization error:", error);
  process.exit(1);
}

const db = admin.firestore();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve frontend build (static files)
app.use(express.static(path.join(__dirname, 'public')));

// Important: 
// Move this *after* API and static routes to avoid conflicts
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware: 
// Remove the 404 handler to avoid conflicts with frontend routes
// This ensures React Router works fine on the frontend

// General error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
