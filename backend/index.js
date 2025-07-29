// Telemetry
const appInsights = require('applicationinsights');
appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING).start();

// Express setup
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Health check endpoint (for Azure slot swap)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Root route
app.get('/', (req, res) => {
  res.send('Habitarium backend is running!');
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
