const Timesheet = require('../models/timesheets');
const Employee = require('../models/employees');
const Project = require('../models/projects');
const Task = require('../models/tasks');

// Get all timesheets
const getAllTimesheets = async (req, res) => {
    try {
        const timesheets = await Timesheet.find({ user: req.user.userId })
            .populate('employee', 'firstName lastName email')
            .populate('project', 'title clientName')
            .populate('task', 'title description')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: timesheets });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get timesheet by ID
const getTimesheetById = async (req, res) => {
    try {
        const { id } = req.params;
        const timesheet = await Timesheet.findOne({ _id: id, user: req.user.userId })
            .populate('employee', 'firstName lastName email')
            .populate('project', 'title clientName')
            .populate('task', 'title description');
        
        if (!timesheet) {
            return res.status(404).json({ success: false, message: 'Timesheet not found' });
        }
        
        res.status(200).json({ success: true, data: timesheet });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Create new timesheet
const createTimesheet = async (req, res) => {
    try {
        const { employee, project, task, date, timeSpent, progress, notes, type } = req.body;

        if (!employee || !project || !task || !date || !timeSpent || !type) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const [employeeDoc, projectDoc, taskDoc] = await Promise.all([
            Employee.findOne({ _id: employee, userId: req.user.userId }),
            Project.findOne({ _id: project, user: req.user.userId }),
            Task.findOne({ _id: task, user: req.user.userId }),
        ]);

        if (!employeeDoc || !projectDoc || !taskDoc) {
            return res.status(404).json({ success: false, message: 'Employee, project, or task not found for this user' });
        }

        const newTimesheet = new Timesheet({
            user: req.user.userId,
            employee,
            project,
            task,
            date,
            timeSpent,
            progress: progress || 0,
            notes,
            type
        });

        await newTimesheet.save();
        const populated = await Timesheet.findById(newTimesheet._id)
            .populate('employee', 'firstName lastName email')
            .populate('project', 'title clientName')
            .populate('task', 'title description');

        res.status(201).json({ success: true, message: 'Timesheet created successfully', data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update timesheet
const updateTimesheet = async (req, res) => {
    try {
        const { id } = req.params;
        const { employee, project, task, date, timeSpent, progress, notes, type } = req.body;

        const timesheet = await Timesheet.findOne({ _id: id, user: req.user.userId });
        if (!timesheet) {
            return res.status(404).json({ success: false, message: 'Timesheet not found' });
        }

        if (employee) {
            const employeeDoc = await Employee.findOne({ _id: employee, userId: req.user.userId });
            if (!employeeDoc) {
                return res.status(404).json({ success: false, message: 'Employee not found for this user' });
            }
            timesheet.employee = employee;
        }

        if (project) {
            const projectDoc = await Project.findOne({ _id: project, user: req.user.userId });
            if (!projectDoc) {
                return res.status(404).json({ success: false, message: 'Project not found for this user' });
            }
            timesheet.project = project;
        }

        if (task) {
            const taskDoc = await Task.findOne({ _id: task, user: req.user.userId });
            if (!taskDoc) {
                return res.status(404).json({ success: false, message: 'Task not found for this user' });
            }
            timesheet.task = task;
        }
        if (date) timesheet.date = date;
        if (timeSpent) timesheet.timeSpent = timeSpent;
        if (progress !== undefined) timesheet.progress = progress;
        if (notes !== undefined) timesheet.notes = notes;
        if (type) timesheet.type = type;

        await timesheet.save();
        const populated = await Timesheet.findById(timesheet._id)
            .populate('employee', 'firstName lastName email')
            .populate('project', 'title clientName')
            .populate('task', 'title description');

        res.status(200).json({ success: true, message: 'Timesheet updated successfully', data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Delete timesheet
const deleteTimesheet = async (req, res) => {
    try {
        const { id } = req.params;
        const timesheet = await Timesheet.findOneAndDelete({ _id: id, user: req.user.userId });
        
        if (!timesheet) {
            return res.status(404).json({ success: false, message: 'Timesheet not found' });
        }

        res.status(200).json({ success: true, message: 'Timesheet deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get timesheets by employee
const getTimesheetsByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const employee = await Employee.findOne({ _id: employeeId, userId: req.user.userId });
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found for this user' });
        }

        const timesheets = await Timesheet.find({ employee: employeeId, user: req.user.userId })
            .populate('employee', 'firstName lastName email')
            .populate('project', 'title clientName')
            .populate('task', 'title description')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: timesheets });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get timesheet statistics
const getTimesheetStats = async (req, res) => {
    try {
        const userFilter = { user: req.user.userId };
        const totalTimesheets = await Timesheet.countDocuments(userFilter);
        const developmentType = await Timesheet.countDocuments({ ...userFilter, type: 'Development' });
        const testType = await Timesheet.countDocuments({ ...userFilter, type: 'Testing' });
        const otherType = await Timesheet.countDocuments({ ...userFilter, type: 'Other' });

        res.status(200).json({
            success: true,
            data: {
                totalTimesheets,
                developmentType,
                testType,
                otherType
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllTimesheets,
    getTimesheetById,
    createTimesheet,
    updateTimesheet,
    deleteTimesheet,
    getTimesheetsByEmployee,
    getTimesheetStats
};

