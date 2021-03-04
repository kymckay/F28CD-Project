const fs = require('fs');
const csv = require('@fast-csv/parse');

exports.readFile = async (filename) => {
  const seen = {}; // Track identifiers to avoid duplicates

  // Data from file will be stored in these objects
  const parties = []; // Political party
  const people = []; // Actual person
  const candidates = []; // Candidate represents a particular campaign

  function processRow(data) {
    // Filter for only parliamentary candidates
    if (data.election.startsWith("parl")) {
      const { id, name, election_date, gss_code, party_ec_id, party_name, elected } = data;

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
        election_date,
        gss_code, // identifies constituency ran in
        elected
      });
    }
  }

  // Returning a promise enables this asynchronous function to work
  return new Promise((resolve, reject) => {
    fs.createReadStream(filename)
      .pipe(csv.parse({ headers: true }))
      .on('error', error => reject(error))
      .on('data', processRow)
      .on('end', rowCount => resolve({parties, people, candidates, rowCount}));
  });
}