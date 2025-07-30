// Telemetry
const appInsights = require('applicationinsights');
appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING)
           .setAutoDependencyCorrelation(true)
           .setAutoCollectRequests(true)
           .setAutoCollectPerformance(true)
           .setAutoCollectExceptions(true)
           .setAutoCollectDependencies(true)
           .setAutoCollectConsole(true)
           .setUseDiskRetryCaching(true)
           .start();

// Express app setup
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const healthRouter = require('./routes/health');


// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
const healthRouter = require('./routes/health');
app.use('/api', healthRouter);

// Root route
app.get('/', (req, res) => {
  res.send('Habitarium backend is running!');
});

// Start server
app.get('/', (_, res) => res.send('OK'));
app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`);
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

console.log("App boot complete. Ready to serve requests.");