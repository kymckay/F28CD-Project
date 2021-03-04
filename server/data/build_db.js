const { MongoClient } = require('mongodb');
const candidates_in = require('./load_candidates');

const uri = 'mongodb://localhost:27017?retryWrites=true&writeConcern=majority';

const client = new MongoClient(uri, { useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db('f28cd');

    const people = database.collection('people');
    // const candidates = database.collection('candidates');
    // const parties = database.collection('parties');

    // First reset any existing data structure
    people.deleteMany({});

    // Insert documents constructed from data files
    await people.insertOne({ name: 'Boris Johnson' });

    // An example of how to query for server later
    // const query = { name: 'Boris Johnson' };
    // const bj = await people.findOne(query);
    // console.log(bj);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

candidates_in.test();