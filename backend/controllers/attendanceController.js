const Attendance = require('../models/attendances');
const Employee = require('../models/employees');

function convertTo24Hour(time12h) {
    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    if (period === 'PM' && hours < 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

function calculateDuration(timeIn, timeOut) {
    const timeInDate = new Date(`2000-01-01T${convertTo24Hour(timeIn)}`);
    const timeOutDate = new Date(`2000-01-01T${convertTo24Hour(timeOut)}`);

    const timeDiff = timeOutDate - timeInDate;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
}

// Mark attendance
const markAttendance = async (req, res) => {
    try {
        const { employeeId, day, timeIn, timeOut } = req.body;

        if (!employeeId || !day) {
            return res.status(400).json({ success: false, message: 'Employee ID and day are required' });
        }

        const employee = await Employee.findOne({ _id: employeeId, userId: req.user.userId });
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found for this user' });
        }

        let existingAttendance = await Attendance.findOne({ employee: employeeId, day: day, user: req.user.userId });

        if (existingAttendance && timeOut && existingAttendance.timeIn) {
            const { hours, minutes } = calculateDuration(existingAttendance.timeIn, timeOut);
            existingAttendance.timeOut = timeOut;
            existingAttendance.workingHours = `${hours} hour:${minutes} minutes`;
            await existingAttendance.save();
            res.status(200).json({ success: true, message: 'Time Out Marked Successfully', data: existingAttendance });
        } else if (timeIn) {
            if (!existingAttendance) {
                const newAttendance = new Attendance({
                    user: req.user.userId,
                    employee: employeeId,
                    day: day,
                    timeIn: timeIn,
                    timeOut: null,
                    workingHours: null,
                });
                await newAttendance.save();
                const populated = await Attendance.findById(newAttendance._id).populate('employee', 'firstName lastName email');
                res.status(201).json({ success: true, message: 'Time In Marked Successfully', data: populated });
            } else {
                res.status(400).json({ success: false, message: 'TimeIn Is Already Exist In Attendance Sheet' });
            }
        } else {
            res.status(400).json({ success: false, message: 'TimeIn Is Missing' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get all attendance records
const getAllAttendance = async (req, res) => {
    try {
        const attendances = await Attendance.find({ user: req.user.userId })
            .populate('employee', 'firstName lastName email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: attendances });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get attendance by employee
const getAttendanceByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const employee = await Employee.findOne({ _id: employeeId, userId: req.user.userId });
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found for this user' });
        }

        const attendances = await Attendance.find({ employee: employeeId, user: req.user.userId })
            .populate('employee', 'firstName lastName email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: attendances });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get attendance by day
const getAttendanceByDay = async (req, res) => {
    try {
        const { day } = req.params;
        const attendances = await Attendance.find({ day, user: req.user.userId })
            .populate('employee', 'firstName lastName email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: attendances });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    markAttendance,
    getAllAttendance,
    getAttendanceByEmployee,
    getAttendanceByDay
};

