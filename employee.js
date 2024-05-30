const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGOURL = process.env.MONGO_URL;

async function ConnectThroughMongoose() {
        mongoose.connect(MONGOURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
      

}

const employeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    gender: String
})

const Employee = mongoose.model("Employee", employeeSchema);

const createEmployee = async (employeeData) => {
    const employee = new Employee(employeeData);
    const savedEmployee = await employee.save();
    return savedEmployee;
};

// Read employee(s)
const getEmployees = async () => {
    console.log("Get employees called");
    const employees = await Employee.find();
    return employees;
};

// Update an employee
const updateEmployee = async (employeeId, updatedData) => {
    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updatedData, { new: true });
    return updatedEmployee;
};

// Delete an employee
const deleteEmployee = async (employeeId) => {
    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
    if (!deletedEmployee) {
        return { isSuccessful: false, message: "Invalid employee" }
    }
    return { isSuccessful: true, message: "Employee deleted successfully" }
};

const getEmployee = async (employeeId) => {
    return await Employee.findById(employeeId)
}

module.exports = { ConnectThroughMongoose, createEmployee, getEmployees, deleteEmployee, updateEmployee, getEmployee }