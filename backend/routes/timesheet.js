const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getAllTimesheets,
    getTimesheetById,
    createTimesheet,
    updateTimesheet,
    deleteTimesheet,
    getTimesheetsByEmployee,
    getTimesheetStats
} = require('../controllers/timesheetController');

// Protect all timesheet routes
router.use(authMiddleware);

// Get all timesheets
router.get('/timesheets', getAllTimesheets);

// Get timesheet statistics
router.get('/timesheets/stats', getTimesheetStats);

// Get timesheet by ID
router.get('/timesheet/:id', getTimesheetById);

// Get timesheets by employee
router.get('/timesheets/employee/:employeeId', getTimesheetsByEmployee);

// Create new timesheet
router.post('/timesheet', createTimesheet);

// Update timesheet
router.put('/timesheet/:id', updateTimesheet);

// Delete timesheet
router.delete('/timesheet/:id', deleteTimesheet);

module.exports = router;