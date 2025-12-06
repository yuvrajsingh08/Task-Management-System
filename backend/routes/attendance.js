const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    markAttendance,
    getAllAttendance,
    getAttendanceByEmployee,
    getAttendanceByDay
} = require('../controllers/attendanceController');

// Protect all attendance routes
router.use(authMiddleware);

// Get all attendance records
router.get('/attendances', getAllAttendance);

// Get attendance by employee
router.get('/attendances/employee/:employeeId', getAttendanceByEmployee);

// Get attendance by day
router.get('/attendances/day/:day', getAttendanceByDay);

// Mark attendance (time in/out)
router.post('/attendance', markAttendance);

module.exports = router;