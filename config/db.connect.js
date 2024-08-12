//packages
let mongoose = require("mongoose")

// local imports
let MONGO_URL = process.env.MONGO_URL;

// Establishing connection
let connection = mongoose.connect(MONGO_URL).catch(error => handleError(error));

//exporting the connection
module.exports = connection;