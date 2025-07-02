const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes for testing
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.post('/login', (req, res) => {
  // Mock authentication logic
  if (req.body.email === "test@test.com" && req.body.password === "password") {
    res.status(200).json({ token: "fake-jwt-token" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get('/profile', (req, res) => {
  // Mock authentication check
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  res.status(200).json({ name: "Test User", email: "test@test.com" });
});

// Export for testing (CRITICAL)
module.exports = app;

// Start server only when not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; 