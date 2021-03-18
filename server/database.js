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