const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const mongo = require('mongodb');

dotenv.config();
const bodyParser = require('body-parser');
const db = require('./db');
const validateRequest = require('./validationMiddleware');

const app = express();
const port = process.env.PORT; // Port to listen on
const collectionName = process.env.MONGO_COLLECTION_NAME;
const allowed_cors_url = process.env.ALLOWED_CORS_URL;
app.use(cors({ origin: allowed_cors_url }));

async function main() {
    try {
        const database = await db.connectToDatabase();

        // Define routes after successful database connection
        // The method get all employee details from mongo db.
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
        //The method creates employee in mongodb.
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

        //The method retrieve employee by given id.
        // If the given id incorrect 404 error will be returned.
        app.get('/api/employees/:id', async (req, res) => {
            try {
                // Access the database connection
                const database = await db.connectToDatabase();
                const collection = database.collection(collectionName); 
                const employeeId = req.params.id.toString();
        
                // Convert the ID to a MongoDB ObjectId
                const objectId = new mongo.ObjectId(employeeId);

                // Find the employee by ID
                const employee = await collection.findOne({ _id: objectId });
        
                if (!employee) {
                    return res.status(404).send("Employee not found");
                }

                res.json(employee);
            } catch (error) {
                console.error("Error fetching employee by ID:", error);
                res.status(500).send("Error retrieving employee");
            }
        });

        // The method updates user by the given id.
        // If the id incorrect 404 error will be returned.
        app.put('/api/employees/:id', async (req, res) => {
            try {
                // Access the database connection
                const database = await db.connectToDatabase();
                const collection = database.collection(collectionName); // Replace with your collection name
        
                // Get the employee ID from the request parameter
                const employeeId = req.params.id;
        
                // Convert the ID to a MongoDB ObjectId
                const objectId = new mongo.ObjectId(employeeId);
        
                // Get the updated employee data from the request body
                const updatedEmployee = req.body;
        
                // Perform the update operation (using findOneAndUpdate)
                const result = await collection.findOneAndUpdate(
                    { _id: objectId },
                    { $set: { 
                        firstName: updatedEmployee.firstName,
                        lastName: updatedEmployee.lastName,
                        email: updatedEmployee.email,
                        phone: updatedEmployee.phone,
                        gender: updatedEmployee.gender

                    } },
                    { returnDocument: 'after' } // Option to return updated document
                );
        
                if (!result) {
                    return res.status(404).send("Employee not found");
                }
        
                // Respond with the updated employee data
                res.json(result.value);
            } catch (error) {
                console.error("Error updating employee:", error);
                res.status(500).send("Error updating employee");
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



