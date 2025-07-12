const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// ✅ Load env variables
require("dotenv").config();

// ✅ Initialize app
const app = express();

// ✅ Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));
app.use(express.json());

// ✅ Firebase Admin Setup
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();

// ✅ Routes will be handled by Firebase client-side

// ✅ Start server
app.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
});