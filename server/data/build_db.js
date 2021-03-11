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
  const [ electionData, candidateData ] = await Promise.all([
    elections_in.readFile(elections_file),
    candidates_in.readFile(candidates_file)
  ]);

  // Unpack the data
  const { parties, people, candidates } = candidateData;

  // Constituency records will be built (one for each constitency each year)
  let constituencies = electionData.map(yd => {
    const cd = yd.constituencies;

    return Object.keys(cd).map(k => ({ gss_code: k, electorate: cd[k].electorate, year: yd.year }));
  });

  // The year-seperated structure has to be flat before insertion
  constituencies = [].concat(...constituencies);

  // Join the election voting data to the candidate records before insertion
  candidates.forEach(c => {
    const year = electionData.filter(d => d.year === c.year)[0];


    // Some candidate data is from unsupported years
    if (!year) return;

    // If candidate party is not registered, they fall under other
    // TODO: Independent candidate votes are all bundled under "Other" in the data and can't be seperated
    const party = c.party_ec_id.startsWith("PP") ? c.party_ec_id : "Other";

    c.votes = year.constituencies[c.gss_code].parties[party];
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


// async function test() {
//   await client.connect();
//   const database = client.db('f28cd');

//   const collection = database.collection("candidates");

//   await collection.find({ year: '2010' }).forEach((d) => console.log(d));

//   await client.close();
// }
// test();