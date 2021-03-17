// This is a utility script to inject the mapbox API key into main.js before bundling and transpilation
// The key is public and safe to share, however we don't want it in our source history
const path = require('path');
const fs = require('fs');

(function (filename) {
  const mainScript = path.join(__dirname, '../public/src/', filename);
  const secretFile = path.join(__dirname, "secrets.json");

  if (!fs.existsSync(secretFile)) {
    console.log("\"secrets.json\" not present in data directory, map won't be loaded!");
    return;
  }

  const secretKey = JSON.parse(fs.readFileSync(secretFile)).mapboxKey;

  // Read in the main.js source code
  const content = fs.readFileSync(mainScript, 'utf-8');

  // Find API key var, replace with key from file
  fs.writeFileSync(
    mainScript,
    content.replace(/const\s+MAPBOX_KEY\s+=.+?;/, `const MAPBOX_KEY = "${secretKey}";`),
    'utf-8'
  );

})("main.js");
