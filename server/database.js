/* eslint-disable no-console */
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/f28cd';
const client = new MongoClient(uri, { useUnifiedTopology: true });

let db;

// Initalises the database connection then runs the callback function
exports.startMongo = function(callback) {
  // Connect once and reuse to avoid unnecessary connection pools
  client.connect((err, database) => {
    if (err) {
      console.warn(`Failed to connect to MongoDB, data won't be real. Reason: ${err.name}.`);
    } else {
      db = database;
    }

    callback();
  });
}

exports.getYears = function () {
  // Test data if DB isn't running
  if (!db) return ['TestYear'];
  return db.db().collection('constituencies').distinct('year');
}

exports.getSources = function () {
  // Test data if DB isn't running
  if (!db) return ['TestSource'];
  return db.db().collection('sources').distinct('name');
}

// All the candidates for a given year
function getCandidates(year) {
  // Test data if DB isn't running
  if (!db) return [{
    party_ec_id: 'TestEcId',
    name: 'TestCandidate',
    gss_code: 'TestGSS',
    elected: true,
    votes: 100,
    predictions: [50],
  }];

  // Want to minimise to only data client needs (reduce data sent)
  return db.db().collection('candidates')
    .find({ year }, {
      projection: {
        _id: 0,
        party_ec_id: 1,
        name: 1,
        gss_code: 1,
        elected: 1,
        votes: 1,
        predictions: 1,
      }
    })
    .toArray();
}

// The constituencies for a given year
function getConstituencies(year) {
  // Test data if DB isn't running
  if (!db) return [{ gss_code: 'TestGSS', electorate: 100 }];

  // Want to minimise to only data client needs (reduce data sent)
  return db.db().collection('constituencies')
    .find({ year }, { projection: {_id: 0, gss_code: 1, electorate: 1} })
    .toArray();
}

function getParties(year) {
  // Test data if DB isn't running
  if (!db) return [{
    party_ec_id: 'TestEcId',
    party_name: 'TestParty',
    votes: 100,
    predictions: [50],
  }];

  return db.db().collection('parties')
    .find({ year }, {
      projection: {
        _id: 0,
        party_ec_id: 1,
        party_name: 1,
        colour: 1,
        votes: 1,
        predictions: 1,
      }
    })
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