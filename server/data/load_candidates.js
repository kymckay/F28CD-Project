const fs = require('fs');
const csv = require('@fast-csv/parse');

exports.readFile = function(filename) {
  fs.createReadStream(filename)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => console.log(row))
    .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
}