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

app.post('/year', express.json({}), async (req, res) => {
  const { year } = req.body;

  // User may have altered dropdown values and sent a bad request
  // First sanity check that they're asking for a year string
  if (!year.match(/^\d{4}$/)) {
    res.status(403).end();
    return;
  }

  const data = await db.getData(year);

  // Deny request if no data exists for year in DB
  // User may be sending bogus requests to try and thrash the DB
  if (!data) {
    res.status(403).end();
    return;
  }

  res.json(data);
});

app.post('/options', async (_, res) => {
  // Sort years from most recent to most historic
  const years = await db.getYears();
  years.sort().reverse();

  const sources = ["Electoral Calculus", "Financial Times", "Bloomberg", "Politico", "BBC"]; // TODO
  res.json({ years, sources });
});

// Start the server after the MongoDB connection is ready
db.startMongo(() => {
  server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
});
