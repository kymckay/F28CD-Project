// This is a utility script to remove the mapbox API key from main.js after bundling and transpilation
// The key is public and safe to share, however we don't want it in our source history
const path = require('path');
const fs = require('fs');

(function (filename) {
  const mainScript = path.join(__dirname, '../public/src/', filename);

  // Read in the main.js source code
  const content = fs.readFileSync(mainScript, 'utf-8');

  // Find API key var, replace with key from file
  fs.writeFileSync(
    mainScript,
    content.replace(/const\s+MAPBOX_KEY\s+=.+?;/, "const MAPBOX_KEY = '';"),
    'utf-8'
  );

})("main.js");
