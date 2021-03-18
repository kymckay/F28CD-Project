// Prerequisite: 'npm install mongoose --save'

const mongoose = require('mongoose');
const fs = require('fs');
mongoose.connect('mongodb://localhost/f28cd')

exports.readFile = async (filename) => {
    console.log("Extracting constituency data...")
    
    // Data from files will be stored in these objects
    const polygonSchema = new mongoose.Schema({
        type: {
          type: String,
          enum: ['Polygon'],
          required: true
        },
        coordinates: {
          type: [[[Number]]], // Array of arrays of arrays of numbers
          required: true
        }
    });
    const constituenciesPolygons = new mongoose.Schema({
        name: String,
        gss_code: String,
        polygon: polygonSchema
    });

    let data = fs.readFileSync(filename);
    let constData = JSON.parse(data);
    constituenciesPolygons.insertMany(constData);

    // load the data
    // Prerequisite: 'npm install body-parser'
}