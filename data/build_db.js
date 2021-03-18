/* eslint-disable no-console */
const path = require('path');
const { MongoClient } = require('mongodb');
const candidates_in = require('./load_candidates');
const elections_in = require('./load_elections');

const uri = 'mongodb://localhost:27017?retryWrites=true&writeConcern=majority';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const candidates_file = path.resolve(__dirname, 'candidates-all.csv');
const elections_file = path.resolve(__dirname, 'election-results.xlsx');
const constituencies_file = path.resolve(__dirname, 'constituencies.geojson');

// Only go back to 2010 as voting data constituency IDs change then
const years = ["2010", "2015", "2017", "2019"];

async function main() {
  // Get relevant candidate and election data in parallel for efficiency
  const [ electionData, candidateData, constituencyData] = await Promise.all([
    elections_in.readFile(elections_file, years),
    candidates_in.readFile(candidates_file, years)
  ]);

  // Unpack the data
  const { parties, people, candidates } = candidateData;

  // Constituency records will be built (one for each constitency each year)
  let constituencies = Object.keys(electionData).map(y => {
    const yearData = electionData[y];
    return Object.keys(yearData).map(k => {
      return {
        gss_code: k,
        electorate: yearData[k].electorate,
        year: y
      };
    });
  });

  // The year-seperated structure has to be flat before insertion
  constituencies = [].concat(...constituencies);

  // Join the election voting data to the candidate records before insertion
  candidates.forEach(c => {
    const { parties: partyVotes } = electionData[c.year][c.gss_code];

    // If candidate party is not recognised, they fall under other
    // TODO: Independent candidate votes are all bundled under "Other" in the data and can't be seperated
    c.votes = partyVotes[c.party_ec_id] ? partyVotes[c.party_ec_id] : partyVotes.Other;

    // If Other has no voting data for the region then the candidate's party is not reflected in the voting data
    if (!c.votes) {
      c.votes = -1;
      console.log(`Warning: No voting data for party "${c.party_ec_id}" in region "${c.gss_code}" of year ${c.year}`);
    }

    // TODO: generate prediction data too (try to make consistent with electorate of region)
  });

  console.log(`Inserting data into MongoDB...`);
  try {
    await client.connect();

    // Must insert records sequentially to avoid DB write conflicts
    await addCollection("parties", parties);
    await addCollection("people", people);
    await addCollection("candidates", candidates);
    await addCollection("constituencies", constituencies);
  } catch (error) {
    console.dir(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log(`Process finished successfully!`);
  }
}

async function addCollection(name, documents) {
  const database = client.db('f28cd');

  const collection = database.collection(name);

  // First reset any existing data structure
  await collection.deleteMany({});

  // Insert documents constructed from data files
  return collection.insertMany(documents);
}

main().catch(console.dir);