const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/f28cd';
const client = new MongoClient(uri, { useUnifiedTopology: true });

let db;

// Initalises the database connection then runs the callback function
exports.startMongo = function(callback) {
  // Connect once and reuse to avoid unnecessary connection pools
  client.connect((err, database) => {
    if (err) throw err;

    db = database;

    callback();
  });
}

exports.getYears = async function() {
  return await db.db().collection('constituencies').distinct('year');
}

// All the candidates for a given year
async function getCandidates(year) {
  // Want to minimise to only data client needs (reduce data sent)
  return db.db().collection('candidates')
    .find({ year }, {
      party_ec_id: true,
      name: true,
      gss_code: true,
      elected: true,
      votes: true,
    }).toArray();
}

// The constituencies for a given year
function getConstituencies(year) {
  // Want to minimise to only data client needs (reduce data sent)
  return db.db().collection('constituencies')
    .find({ year }, { gss_code: true, electorate: true })
    .toArray();
}

// TODO: Filter to only parties of candidates of that year
function getParties(year) {
  return db.db().collection('parties')
    .find({}, { party_ec_id: true, party_name: true })
    .toArray();
}

exports.getData = async function(year) {
  // Check year exists in the DB before any extensive querying
  if (!(await db.db().collection('candidates').findOne({ year }))) return;

  const [candidates, constituencies, parties] = await Promise.all([
    getCandidates(year),
    getConstituencies(year),
    getParties(year)
  ]);

  return {
    candidates,
    constituencies,
    parties
  };
}