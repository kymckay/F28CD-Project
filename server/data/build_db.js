/* eslint-disable no-console */
const path = require('path');
const { MongoClient } = require('mongodb');
const candidates_in = require('./load_candidates');
const elections_in = require('./load_elections');

const uri = 'mongodb://localhost:27017?retryWrites=true&writeConcern=majority';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const candidates_file = path.resolve(__dirname, 'candidates-all.csv');
const elections_file = path.resolve(__dirname, 'election-results.xlsx');

async function main() {
  // Get relevant candidate data
  const { parties, people, candidates } = await candidates_in.readFile(candidates_file);

  try {
    await client.connect();

    // Insert records sequentially to avoid DB write conflicts
    await addCollection("parties", parties);
    console.log(`Processed ${parties.length} party records`);
    await addCollection("people", people);
    console.log(`Processed ${people.length} person records`);
    await addCollection("candidates", candidates);
    console.log(`Processed ${candidates.length} candidate records`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function addCollection(name, documents) {
  const database = client.db('f28cd');

  const collection = database.collection(name);
  // const candidates = database.collection('candidates');
  // const parties = database.collection('parties');

  // First reset any existing data structure
  await collection.deleteMany({});

  // Insert documents constructed from data files
  return collection.insertMany(documents);
}

main().catch(console.dir);