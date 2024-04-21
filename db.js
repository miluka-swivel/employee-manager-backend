const { MongoClient } = require('mongodb');
const dotenv = require("dotenv");
dotenv.config();
const MONGOURL = process.env.MONGO_URL;

const client = new MongoClient(MONGOURL);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
        return client.db("employeedatabase"); // Replace with your database name
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
        process.exit(1);
    }
}

module.exports = { connectToDatabase };
