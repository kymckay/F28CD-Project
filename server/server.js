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

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
