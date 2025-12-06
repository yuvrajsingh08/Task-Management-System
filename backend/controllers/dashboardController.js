const Task = require('../models/tasks');
const Project = require('../models/projects');
const Employee = require('../models/employees');
const Attendance = require('../models/attendances');
const Timesheet = require('../models/timesheets');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const userFilter = { user: req.user.userId };

        // Task statistics
        const totalTasks = await Task.countDocuments(userFilter);
        const pendingTasks = await Task.countDocuments({ ...userFilter, status: 'Pending' });
        const inProgressTasks = await Task.countDocuments({ ...userFilter, status: 'In Progress' });
        const completedTasks = await Task.countDocuments({ ...userFilter, status: 'Completed' });

        // Project statistics
        const totalProjects = await Project.countDocuments(userFilter);
        const activeProjects = await Project.countDocuments({ ...userFilter, status: 'In Progress' });
        const completedProjects = await Project.countDocuments({ ...userFilter, status: 'Completed' });

        // Employee statistics
        const totalEmployees = await Employee.countDocuments(userFilter);
        const activeEmployees = await Employee.countDocuments({ ...userFilter, status: 'Active' });

        // Recent tasks
        const recentTasks = await Task.find(userFilter)
            .populate('assignTo', 'firstName lastName')
            .populate('project', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        // Recent projects
        const recentProjects = await Project.find(userFilter)
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                tasks: {
                    total: totalTasks,
                    pending: pendingTasks,
                    inProgress: inProgressTasks,
                    completed: completedTasks
                },
                projects: {
                    total: totalProjects,
                    active: activeProjects,
                    completed: completedProjects
                },
                employees: {
                    total: totalEmployees,
                    active: activeEmployees
                },
                recentTasks,
                recentProjects
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getDashboardStats
};

