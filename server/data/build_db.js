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
  // Get relevant candidate and election data in parallel for efficiency
  console.log("Extracting election data...");
  console.log("Extracting candidate data...");
  const [ electionData, candidateData] = await Promise.all([
    elections_in.readFile(elections_file),
    candidates_in.readFile(candidates_file)
  ]);

  // Unpack the data
  const [data2019, data2017, data2012, data2010] = electionData;
  const { parties, people, candidates } = candidateData;

  console.log(`Extracted ${parties.length} party records`);
  console.log(`Extracted ${people.length} person records`);
  console.log(`Extracted ${candidates.length} candidate records`);


  console.log(`Inserting data into MongoDB...`);
  try {
    await client.connect();

    // Insert records sequentially to avoid DB write conflicts
    await addCollection("parties", parties);
    await addCollection("people", people);
    await addCollection("candidates", candidates);
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
  // const candidates = database.collection('candidates');
  // const parties = database.collection('parties');

  // First reset any existing data structure
  await collection.deleteMany({});

  // Insert documents constructed from data files
  return collection.insertMany(documents);
}

main().catch(console.dir);