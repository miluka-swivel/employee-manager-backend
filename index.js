const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');

dotenv.config();
const bodyParser = require('body-parser');
const db = require('./db'); // Import the database connection function
const validateRequest = require('./validationMiddleware');

const app = express();
const port = process.env.PORT; // Port to listen on
const collectionName = process.env.MONGO_COLLECTION_NAME;
app.use(cors({ origin: "http://localhost:3000" }));

async function main() {
    try {
        const database = await db.connectToDatabase();

        // Define routes after successful database connection
        app.get('/api/employees', async (req, res) => {
            try {
                const collection = database.collection(collectionName);
                const data = await collection.find().toArray();
                res.json(data);
            } catch (error) {
                console.error("Error fetching data:", error);
                res.status(500).send("Error retrieving data");
            }
        });

        //Express does not default have json body parser. Therefore use one.
        app.use(bodyParser.json());
        app.post('/api/employees', validateRequest, async (req, res) => {
            try {
                const collection = database.collection(collectionName);
                const newEmployee = req.body;
                const result = await collection.insertOne(newEmployee);
                res.json({id :result.insertedId});
            } catch (error) {
                console.error("Error adding employee:", error);
                res.status(500).send("Error adding employee");
            }
        });

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

main();



