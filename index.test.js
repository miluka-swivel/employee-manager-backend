const { getEmployees, createEmployee, getEmployee } = require("./employee");
jest.mock("./employee");

const request = require('supertest');
const app = require('./index'); // Replace with your app file 
const mongoose = require('mongoose');
jest.mock('mongoose');
const mockConnect = jest.fn();



describe('Tests for employee apis', () => {
    beforeEach(async () => {
        // Create a mock function for mongoose.connect
        await mongoose.connect.mockReturnValue(mockConnect.mockResolvedValue(true)); // Simulate successful connection

    });

    afterAll(async () => {
        jest.restoreAllMocks();
    });

    describe("Get api employees", () => {
        it('should return a list of employees', async () => {
            const mockEmployees = [
                { firstName: 'John Doe', lastName: 'DavidBro' },
                { firstName: 'Jane Smith', lastName: 'Marketing' },
            ];

            // Mock getEmployees function
            getEmployees.mockResolvedValue(mockEmployees);
            const res = await request(app).get('/api/employees');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockEmployees);
        });

        it('should show errors if employee saving fails', async () => {

            getEmployees.mockRejectedValue(new Error('Error retrieving data'))
            const res = await request(app).get('/api/employees');
            expect(res.statusCode).toBe(500);
            expect(res.text).toContain('Error retrieving data');
        });
    });

    describe('POST /api/employees', () => {
        it('should create a new employee', async () => {
            const newEmployee = {
                firstName: "MilukaDD",
                lastName: "De Silva t",
                email: "miluka@gmail",
                phone: "+94775065089",
                gender: "M"
            };
            const mockResult = { insertedId: '123' };
            createEmployee.mockResolvedValue({ insertedId: '123' });
            const res = await request(app).post('/api/employees').send(newEmployee);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ insertedId: '123' });
        });

        it('should show first name is required if first name is not provided', async () => {
            // Assuming validationMiddleware throws an error for missing name
            // Modify import if middleware is separate
            const invalidResponse = {
                "errors": [
                    {
                        "message": "First name is required"
                    },
                    {
                        "message": "Minimum length is 6 characters"
                    }
                ]
            }

            const invalidEmployee = {
                firstName: "",
                lastName: "De Silva t",
                email: "miluka@gmail",
                phone: "+94775065089",
                gender: "M"
            };
            createEmployee.mockRejectedValue(invalidResponse);
            const res = await request(app).post('/api/employees').send(invalidEmployee);
            expect(res.statusCode).toBe(400); // Or appropriate validation error code
            expect(res.text).toContain('First name is required'); // Or more specific error message
        });

        it('should handle database errors', async () => {
            createEmployee.mockRejectedValue(new Error("Error adding employee"));
            const newEmployee = {
                firstName: "MilukaDil",
                lastName: "De Silva t",
                email: "miluka@gmail",
                phone: "+94775065089",
                gender: "M"
            };

            const res = await request(app).post('/api/employees').send(newEmployee);
            expect(res.statusCode).toBe(500);
            expect(res.text).toContain('Error adding employee');
        });
    });

    describe("GET /api/employee:id Get employee by id", () => {
        it("Should return employee when correcct employee id given", async () => {
            const employeeId = "123";
            const existingEmployee = {
                id: "123",
                firstName: "MilukaDil",
                lastName: "De Silva t",
                email: "miluka@gmail",
                phone: "+94775065089",
                gender: "M"
            };
            getEmployee.mockResolvedValue(existingEmployee);
            const res = await request(app).get(`/api/employees/${employeeId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(existingEmployee);

        });

        // it("Shoul return Employee not found when incorrect employee id given", async () => {
        //     getEmployee.mockRejectedValue(new Error("Employee not found"));
        //     const employeeId = "234";
        //     const res = await request(app).get(`/api/employees/${employeeId}`);
        //     console.log(res.body)
        //     expect(res.statusCode).toBe(400);
        //     expect(res.text).toContain("Employee not found");
        // })

    });
});