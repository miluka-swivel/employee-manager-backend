const request = require('supertest');
const app = require('./index'); // Replace with your app file path

const mongoose = require('mongoose');
jest.mock('mongoose');
const mockConnect = jest.fn();
//jest.mock("./employee");
const { getEmployees } = require("./employee");

describe('GET /api/employees', () => {
    beforeEach(async () => {
        // Create a mock function for mongoose.connect
        await mongoose.connect.mockReturnValue(mockConnect.mockResolvedValue(true)); // Simulate successful connection

    });

    afterAll(async () => {
        // Restore the original implementation
        //jest.restoreAllMocks();
        //mongoose.connection.close();
        //mockConnect.close();

    });

    it('should return a list of employees', async () => {
        const mockEmployees = [
            { firstName: 'John Doe', lastName: 'DavidBro' },
            { firstName: 'Jane Smith', lastName: 'Marketing' },
        ];

        // Mock getEmployees function
        jest.spyOn(require("./employee"), 'getEmployees').mockImplementation(() => mockEmployees);
        

        const res = await request(app).get('/api/employees');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockEmployees);
    });

    // it('should handle errors', async () => {
    //     jest.spyOn(require('./employee'), 'getEmployees').mockRejectedValue(new Error('Database error'));

    //     const res = await request(app).get('/api/employees');

    //     expect(res.statusCode).toBe(500);
    //     expect(res.text).toContain('Error retrieving data');
    // });
});