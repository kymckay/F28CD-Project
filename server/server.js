const express = require('express');
const http = require('http');
const path = require('path');

const port = process.env.PORT || 8080; // Backup for locally ran testing

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Files stored statically in public folder
app.use(express.static(path.join(__dirname, '../public/')));

app.post('/year', express.json({}), (req, res) => {
  console.log(req.body);

  // TODO: If request is bad (non-year data) deny it
  if (true) {
    res.status(403).end();
    return;
  }

  // TODO: Populate payload
  res.send({});
})

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
