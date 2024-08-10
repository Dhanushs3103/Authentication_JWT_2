//packages
import dotenv from "dotenv"
dotenv.config();
import mongoose from "mongoose";

// local imports
let MONGO_URL = process.env.MONGO_URL;

// Establishing connection
let connection = mongoose.connect(MONGO_URL);

//exporting the connection
 export default connection