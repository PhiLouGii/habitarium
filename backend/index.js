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

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
const healthRouter = require('./routes/health');
app.use('/api', healthRouter);

app.get('/', (req, res) => {
  res.send('Habitarium backend is running!');
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start
app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`);
});
