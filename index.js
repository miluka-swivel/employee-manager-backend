const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const mongo = require('mongodb');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

dotenv.config();
const bodyParser = require('body-parser');
const db = require('./db');
const validateRequest = require('./validationMiddleware');

const app = express();
app.use(express.urlencoded({ extended: true }));
// This is required to handle urlencoded data
app.use(express.json());
const port = process.env.PORT; // Port to listen on
const collectionName = process.env.MONGO_COLLECTION_NAME;
const allowed_cors_url = process.env.ALLOWED_CORS_URL;
app.use(cors({ origin: allowed_cors_url }));


async function main() {
    try {
        const database = await db.connectToDatabase();

        // Define routes after successful database connection
        // The method get all employee details from mongo db.

        /**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get a list of all employees
 *     tags: [Employees]
 * 
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data: [{}]
 *       400:
 *         description: Bad Request
 *         content:
 *          application/json:
 *            example:
 *             error:
 *              message: "Bad Request"
 */
        //Get All Employees

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
        /**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *           
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data: [{}]
 *       400:
 *         description: Invalid request
 */
        app.use(bodyParser.json());
        app.post('/api/employees', validateRequest, async (req, res) => {
            try {
                const collection = database.collection(collectionName);
                const newEmployee = req.body;
                const result = await collection.insertOne(newEmployee);
                res.json({ id: result.insertedId });
            } catch (error) {
                console.error("Error adding employee:", error);
                res.status(500).send("Error adding employee");
            }
        });

        //The method retrieve employee by given id.
        // If the given id incorrect 404 error will be returned.
        /**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Get a employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The _id of the employee
 *         schema:
 *           type: string
 *         example:
 *             658918e852a0131af4c0aab1
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data: [{}]
 *       404:
 *         description: Employee not found
 */
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
        /**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Update an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the employee
 *         schema:
 *           type: string
 *           format: uuid  # Assuming ID is a UUID format
 *           example:
 *             658918e852a0131af4c0aab1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful update
 *         content:
 *           application/json:
 *             example:
 *               message: 'Employee updated successfully'
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             example:
 *               message: 'Employee not found'
 */



        //Update the Employee

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
                    {
                        $set: {
                            firstName: updatedEmployee.firstName,
                            lastName: updatedEmployee.lastName,
                            email: updatedEmployee.email,
                            phone: updatedEmployee.phone,
                            gender: updatedEmployee.gender

                        }
                    },
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
main();



