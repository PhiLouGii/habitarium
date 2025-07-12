const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// ✅ Load env variables
require("dotenv").config();

// ✅ Initialize app
const app = express();

// ✅ Middlewares
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());

// ✅ Firebase Admin Setup
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID, 
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID, 
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL 
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: "habitarium-d1aab.appspot.com"
});

const db = admin.firestore();

// ✅ Routes will be handled by Firebase client-side

// ✅ Start server
app.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
});