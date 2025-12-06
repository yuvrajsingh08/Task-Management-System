const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    removeEmployee,
    updateEmployee,
} = require('../controllers/employeeController');
const Employee = require('../models/employees');

// Protect all employee routes
router.use(authMiddleware);

// Get all employees
router.get('/employees', getAllEmployees);

// Get employee by ID
router.get('/employee/:id', getEmployeeById);

// Get employee statistics
router.get('/employees/stats', async (req, res) => {
    try {
        const ownerFilter = { userId: req.user.userId };
        const totalEmployees = await Employee.countDocuments(ownerFilter);
        const activeEmployees = await Employee.countDocuments({ ...ownerFilter, status: 'Active' });
        const inActiveEmployees = await Employee.countDocuments({ ...ownerFilter, status: 'In Active' });
        const terminatedEmployees = await Employee.countDocuments({ ...ownerFilter, status: 'Terminated' });

        res.status(200).json({
            success: true,
            data: {
                totalEmployees,
                activeEmployees,
                inActiveEmployees,
                terminatedEmployees
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Create new employee
router.post('/employee', addEmployee);

// Update employee
router.put('/employee/:id', updateEmployee);

// Delete employee (soft delete)
router.delete('/employee/:id', removeEmployee);

module.exports = router;