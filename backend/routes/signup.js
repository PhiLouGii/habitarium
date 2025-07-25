const express = require('express');
const bcrypt = require('bcryptjs');
const { auth, db } = require('../config/firebase'); // Your Firebase Admin SDK config
const router = express.Router();

// Signup (register) new user
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    // Check if user already exists in Firestore (by email)
    const userSnapshot = await db.collection('users')
      .where('email', '==', email)
      .get();

    if (!userSnapshot.empty) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    // Hash password for Firestore storage (optional but recommended)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare Firestore user document
    const userData = {
      uid: userRecord.uid,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      habitsTracked: 0,
      streaks: {},
      achievements: [],
    };

    // Save user document in Firestore
    await db.collection('users').doc(userRecord.uid).set(userData);

    // Respond success
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Signup error:', error);

    // Firebase Auth common errors
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ message: 'Email already registered' });
    }
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (error.code === 'auth/weak-password') {
      return res.status(400).json({ message: 'Password should be at least 6 characters' });
    }

    // General server error
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

module.exports = router;
