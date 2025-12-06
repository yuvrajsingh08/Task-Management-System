const Employee = require("../models/employees");

const getAllEmployees = async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === "true";
    const userFilter = { userId: req.user.userId };
    const filter = includeInactive ? userFilter : { ...userFilter, status: { $ne: "false" } };
    const employees = await Employee.find(filter).sort({
      firstName: 1,
      lastName: 1,
    });
    return res.status(200).json({ success: true, data: employees });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// Get employee by id
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({ _id: id, userId: req.user.userId });
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    return res.status(200).json({ success: true, data: employee });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// Add a new employee
const addEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      status,
      gender,
    } = req.body;
    // basic validation
    if (
      !firstName ||
      !email ||
      !phone ||
      !role ||
      !status ||
      !gender
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const existing = await Employee.findOne({ email, userId: req.user.userId });
    if (existing)
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });

    const employee = new Employee({
      userId: req.user.userId,
      firstName,
      lastName,
      email,
      phone,
      role,
      status,
      gender,
    });
    await employee.save();
    return res.status(201).json({ success: true, data: employee });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// Soft remove: set status to 'false' (does not delete the document)
const removeEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({ _id: id, userId: req.user.userId });
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    employee.status = "false";
    await employee.save();
    return res
      .status(200)
      .json({
        success: true,
        message: "Employee removed (status set to false)",
        data: employee,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Prevent ownership hijack
    delete updateData.userId;

    const employee = await Employee.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    return res.status(200).json({ success: true, message: "Employee updated successfully", data: employee });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  removeEmployee,
  updateEmployee,
};
