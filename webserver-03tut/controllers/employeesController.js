const Employee = require("../models/Employee");

// get
const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees)
    return res.status(204).json({ message: "No employees found!" });
  res.json(employees);
};

// post
const createNewEmployee = async (req, res) => {
  const { firstname, lastname } = req.body; // destructuring assignment
  if (!firstname || !lastname)
    return res
      .status(400)
      .json({ message: "Firstname and lastname are required!" });

  try {
    const employee = await Employee.create({ firstname, lastname });
    res.status(201).json(employee);
  } catch (err) {
    console.err(err);
  }
};

// put
const updateEmployee = async (req, res) => {
  const { id, firstname, lastname } = req.body; // destructuring assignment
  const employee = await Employee.findOne({ _id: id }).exec();
  if (!employee) {
    return res.status(400).json({ message: `No employee matches ID ${id}!` });
  }

  if (firstname) employee.firstname = firstname; // update firstname if provided
  if (lastname) employee.lastname = lastname; // update lastname if provided

  const result = await employee.save();
  res.json(result);
};

// get employee
const getEmployee = async (req, res) => {
  if (req?.params?.id)
    res.status(400).json({ message: "Employee ID required!" });
  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    return res
      .status(400)
      .json({ message: `No employee matches ID ${req.params.id}!` });
  }

  res.json(employee);
};

// delete employee
const deleteEmployee = async (req, res) => {
  if (req?.body?.id) res.status(400).json({ message: "Employee ID required!" });
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(400)
      .json({ message: `No employee matches ID ${req.body.id}!` });
  }

  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  getEmployee,
  deleteEmployee,
};
