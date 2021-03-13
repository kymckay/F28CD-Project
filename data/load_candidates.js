/* eslint-disable no-console */
const fs = require('fs');
const csv = require('@fast-csv/parse');

exports.readFile = async (filename, years) => {
  console.log("Extracting candidate data...");
  const seen = {}; // Track identifiers to avoid duplicates

  // Data from file will be stored in these objects
  const parties = []; // Political party
  const people = []; // Actual person
  const candidates = []; // Candidate represents a particular campaign

  function processRow(data) {
    // Filter for only parliamentary candidates
    if (data.election.startsWith("parl")) {
      const { id, name, election_date, gss_code, party_ec_id, party_name, elected } = data;
      const year = election_date.substr(0, 4);

      // Don't care about candidates in unrequested years
      if (years.every(y => y !== year)) return;

      // Store each party once (by electoral commision ID)
      if (!seen[party_ec_id]) {
        parties.push({
          party_ec_id,
          party_name
        });

        seen[party_ec_id] = true;
      }

      // Store the person as a separate object once
      if (!seen[id]) {
        people.push({
          id,
          name
        });

        seen[id] = true;
      }

      candidates.push({
        id,
        party_ec_id,
        year,
        gss_code, // identifies constituency ran in
        elected: elected.toLowerCase() === 'true'
      });
    }
  }

  // Returning a promise enables this asynchronous function to work
  return new Promise((resolve, reject) => {
    fs.createReadStream(filename)
      .pipe(csv.parse({ headers: true }))
      .on('error', error => reject(error))
      .on('data', processRow)
      .on('end', rowCount => {
        console.log(`Extracted ${parties.length} party records`);
        console.log(`Extracted ${people.length} person records`);
        console.log(`Extracted ${candidates.length} candidate records`);
        resolve({parties, people, candidates, rowCount});
      });
  });
}