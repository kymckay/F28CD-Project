/* eslint-disable no-console */
const express = require('express');
const http = require('http');
const path = require('path');
const db = require('./database');

const port = process.env.PORT || 8080; // Backup for locally ran testing

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Files stored statically in public folder
app.use(express.static(path.join(__dirname, '../public/')));

app.post('/year', express.json({}), (req, res) => {
  const { year } = req.body;

  // User may have altered dropdown values and sent a bad request
  // First sanity check that they're asking for a year string
  if (!year.match(/^\d{4}$/)) {
    res.status(403).end();
    return;
  }

  // TODO: Fetch data for year from MongoDB

  // TODO: Deny request if no data found in DB for requested year

  // TODO: Populate payload
  res.json({});
});

app.post('/years', async (_, res) => {
  // TODO: Get available years from MongoDB and data for the first year
  const years = await db.getYears();

  // TODO populate payload
  res.json({
    years,
    sources: ["Electoral Calculus", "Financial Times", "Bloomberg", "Politico", "BBC"],
    candidates: [{ name: "Boris Johnson", votes: 12345 }, { name: "Nicola Sturgeon", votes: 2222 }, { name: "Keir Starmer", votes: 13536 }]
  });
});

// Start the server after the MongoDB connection is ready
db.startMongo(() => {
  server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
});
