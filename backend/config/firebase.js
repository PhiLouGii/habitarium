const admin = require('firebase-admin');

// Safe private key handling
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : null;

if (!privateKey) {
  console.error('❌ FIREBASE_PRIVATE_KEY is missing or empty!');
  process.exit(1);
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    console.log("✅ Firebase initialized");
  } catch (error) {
    console.error("🔥 Critical Firebase init error:", error);
    process.exit(1);
  }
}

// Create and export the instances
const auth = admin.auth();
const db = admin.firestore();

// Export everything your routes need
module.exports = {
  admin,
  auth,
  db
};
