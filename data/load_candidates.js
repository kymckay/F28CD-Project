/* eslint-disable no-console */
const fs = require('fs');
const csv = require('@fast-csv/parse');

// By-elections are indistinguishable from general in the dataset
// We want to skip over them to prevent duplicate candidate records
const byElections = {
  '2017-02-23': true, // Copeland & Stoke-on-Trent Central
  '2019-04-04': true, // Newport West
  '2019-06-06': true, // Peterborough
  '2019-08-01': true, // Brecon and Radnorshire
};

// Party colours sourced from Wikidata (hardcoded for simplicity, could be queried at runtime)
// Just the most popular that will show on the graph/legend
const colours = {
  'PP52': '#0087DC',
  'PP53': '#DC241F',
  'PP102': '#FFF95D',
  'PP90': '#FAA61A',
  'PP70': '#D46A4C',
  'PP39': '#008800',
  'PP77': '#3F8428',
  'PP55': '#3A9E84',
  'PP63': '#6AB023',
  'PP130': '#62A439',
  'PP305': '#8DC63F',
  'PP103': '#F6CB2F',
  'PP85': '#70147A',
  'PP7931': '#12B6CF',
  'PP3960': '#00008B',
}

const fontColour = {
  'PP53': '#FFFFFF',
  'PP77': '#FFFFFF',
  'PP85': '#FFFFFF',
  'PP3960': '#FFFFFF'
}

exports.readFile = async (filename, years, sources) => {
  console.log("Extracting candidate data...");
  // Data from file will be stored in these objects
  const parties = {}; // Political party
  const constituencies = {};
  const candidates = []; // Candidate represents a particular campaign

  function processRow(data) {
    // Filter for only parliamentary candidates
    if (data.election.startsWith("parl")) {
      const { name, election_date, gss_code, post_label, party_ec_id, party_name, elected } = data;

      // Prevent duplicate records from by-elections in the same year
      if (election_date in byElections) return;

      // Don't care about candidates in unrequested years
      const year = election_date.substr(0, 4);
      if (years.every(y => y !== year)) return;

      // Store each party once per year they had a candidate (by electoral commision ID)
      // Storing for each year allows quick querying when live
      const partyKey = `${party_ec_id}${year}`;
      if (!parties[partyKey]) {
        parties[partyKey] = {
          party_ec_id,
          party_name,
          year,
          colour: colours[party_ec_id],
          predictions: sources.map(() => 0) // Populated when data joined later
        };
      }

      // Store each constituency once per year (for the names)
      const constKey = `${gss_code}${year}`;
      if (!constituencies[constKey]) {
        constituencies[constKey] = {
          name: post_label,
          gss_code,
          year
        };
      }

      candidates.push({
        name,
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
      .on('end', () => {
        console.log(`Extracted ${Object.keys(parties).length} party records`);
        console.log(`Extracted ${candidates.length} candidate records`);
        console.log(`Extracted ${Object.keys(constituencies).length} constituency records`);
        resolve({ parties, candidates, constituencies });
      });
  });
}