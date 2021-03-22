/* eslint-disable no-console */
const path = require('path');
const { MongoClient } = require('mongodb');
const candidates_in = require('./load_candidates');
const elections_in = require('./load_elections');

const uri = 'mongodb://localhost:27017?retryWrites=true&writeConcern=majority';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const candidates_file = path.resolve(__dirname, 'candidates-all.csv');
const elections_file = path.resolve(__dirname, 'election-results.xlsx');

// Only go back to 2010 as voting data constituency IDs change then
const years = ["2010", "2015", "2017", "2019"];
// Used to generate prediction data
const sources = ["Electoral Calculus", "Politico", "Opinium", "YouGov", "Ipsos MORI"];

async function main() {
  // Get relevant candidate and election data in parallel for efficiency
  const [ electionData, candidateData ] = await Promise.all([
    elections_in.readFile(elections_file, years),
    candidates_in.readFile(candidates_file, years, sources)
  ]);

  // Unpack the data
  const { parties, candidates, constituencies } = candidateData;

  // Inject electorate into constituency records (one exists per year)
  for (const k in constituencies) {
    const c = constituencies[k];
    c.electorate = electionData[c.year][c.gss_code].electorate;

    // Generate random prediction data for the candidates running here the same year
    const cands = candidates.filter(ca => (ca.year === c.year) && (ca.gss_code === c.gss_code));

    // Randomly distribute the electorate for each source
    let votes = sources.map(() => c.electorate);
    cands.forEach(ca => {
      ca.predictions = votes.map(v => Math.floor(Math.random() * v));

      // Update the remaining votes available
      votes = votes.map((v,i) => v - ca.predictions[i]);
    });
  }

  // Join the election voting data to the candidate records before insertion
  candidates.forEach(c => {
    const { parties: partyVotes } = electionData[c.year][c.gss_code];

    // All leser known parties are all bundled under "Other" in the data and can't be seperated
    c.votes = partyVotes[c.party_ec_id] ? partyVotes[c.party_ec_id] : partyVotes.Other; // TODO: Distribute instead of duplicating votes

    // If Other has no voting data for the region then the candidate's party is not reflected in the voting data
    if (!c.votes) {
      c.votes = Math.floor(Math.random() * 20);
      console.log(`Warning: No voting data for party "${c.party_ec_id}" in region "${c.gss_code}" of year ${c.year}`);
    }
  });

  // Determine seats won for each year and predicted seats won
  for (const k in parties) {
    const p = parties[k];

    // Count party candidates in same year
    const cands = candidates.filter(c => (c.year === p.year) && (c.party_ec_id === p.party_ec_id));

    // Each constituency won is a seat
    p.seats = cands.filter(c => c.elected).length;
    p.predictions = sources.map(() => p.seats); // TODO
  }

  console.log(`Inserting data into MongoDB...`);
  try {
    await client.connect();

    // Must insert records sequentially to avoid DB write conflicts
    await addCollection("sources", sources.map(s => ({name: s})))
    await addCollection("parties", Object.values(parties));
    await addCollection("candidates", candidates);
    await addCollection("constituencies", Object.values(constituencies));
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