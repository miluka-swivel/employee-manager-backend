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
const { ConnectThroughMongoose, getEmployees, createEmployee, updateEmployee, getEmployee, deleteEmployee } = require('./employee');

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
        await ConnectThroughMongoose();
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
                const data = await getEmployees();
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
                const newEmployee = req.body;
                const result = await createEmployee(newEmployee);
                res.json(result);
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
                const employeeId = req.params.id.toString();
                const employee = await getEmployee(employeeId);
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

        app.put('/api/employees/:id', validateRequest,  async (req, res) => {
            try {
                // Get the employee ID from the request parameter
                const employeeId = req.params.id;
                const updatedEmployee = req.body;
                const result = await updateEmployee(employeeId, updatedEmployee);
                if (!result) {
                    return res.status(404).send("Employee not found");
                }
                res.json(result.value);
            } catch (error) {
                console.error("Error updating employee:", error);
                res.status(500).send("Error updating employee");
            }
        });

        app.delete("/api/employees/:id", async (req, res) => {
            try {
                const employeeId = req.params.id;
                const result = await deleteEmployee(employeeId);
                if (!result.isSuccessful) {
                    return res.status(404).send("Employee not found");
                }
                res.json(result.isSuccessful);
            }
            catch (error) {
                console.error("Failed deleting employee:", error);
                res.status(500).send("Failed deleting employee");
            }
        })

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
module.exports = app; 



