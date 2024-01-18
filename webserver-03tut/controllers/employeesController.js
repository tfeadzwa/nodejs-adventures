const data = {
  employees: require("../models/employees.json"),
  setEmployee: function (data) {
    this.employees = data;
  },
};

// get
const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

// post
const createNewEmployee = (req, res) => {
  const { firstname, lastname } = req.body; // destructuring assignment
  if (!req.body.firstname || !req.body.lastname) {
    return res
      .status(400)
      .json({ message: "Firstname and lastname are required!" });
  }

  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 ?? 1,
    firstname,
    lastname,
  };

  data.setEmployee([...data.employees, newEmployee]);
  res.status(200).json(data.employees);
};

// put
const updateEmployee = (req, res) => {
  const { id, firstname, lastname } = req.body; // destructuring assignment
  const employee = data.employees.find((element) => element.id === id); // find method
  if (!employee) {
    return res.status(404).json({ message: "Employee not found!" });
  }

  employee.firstname = firstname || employee.firstname; // update firstname if provided
  employee.lastname = lastname || employee.lastname; // update lastname if provided

  data.setEmployee(data.employees);
  res.status(200).json(data.employees);
};

// get employee
const getEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id)
  );

  if (!employee)
    return res
      .status(400)
      .json({ message: `Employee ID ${req.params.id} not found!` });

  res.json(employee);
};

// delete employee
const deleteEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );

  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found!` });
  }

  const filteredEmployees = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  data.setEmployee(filteredEmployees);
  res.json(data.employees);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  getEmployee,
  deleteEmployee,
};
