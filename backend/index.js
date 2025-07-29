const appInsights = require('applicationinsights');
appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING).start();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Habitarium backend is running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
