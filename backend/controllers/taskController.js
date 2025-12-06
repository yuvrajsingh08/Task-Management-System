const Task = require('../models/tasks');
const Employee = require('../models/employees');
const Project = require('../models/projects');

// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.userId })
            .populate('assignTo', 'firstName lastName email')
            .populate('project', 'title clientName')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ _id: id, user: req.user.userId })
            .populate('assignTo', 'firstName lastName email')
            .populate('project', 'title clientName');
        
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Create new task
const createTask = async (req, res) => {
    try {
        const { title, description, assignTo, project, startDate, endDate, priority, status } = req.body;

        if (!title || !assignTo || !project || !startDate || !priority) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const [assignee, projectDoc] = await Promise.all([
            Employee.findOne({ _id: assignTo, userId: req.user.userId }),
            Project.findOne({ _id: project, user: req.user.userId }),
        ]);

        if (!assignee || !projectDoc) {
            return res.status(404).json({ success: false, message: 'Assigned employee or project not found for this user' });
        }

        const newTask = new Task({
            user: req.user.userId,
            title,
            description,
            assignTo,
            project,
            startDate,
            endDate,
            priority,
            status: status || 'Pending'
        });

        await newTask.save();
        const populatedTask = await Task.findById(newTask._id)
            .populate('assignTo', 'firstName lastName email')
            .populate('project', 'title clientName');

        res.status(201).json({ success: true, message: 'Task created successfully', data: populatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, assignTo, project, startDate, endDate, priority, status } = req.body;

        const task = await Task.findOne({ _id: id, user: req.user.userId });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        if (assignTo) {
            const assignee = await Employee.findOne({ _id: assignTo, userId: req.user.userId });
            if (!assignee) {
                return res.status(404).json({ success: false, message: 'Assigned employee not found for this user' });
            }
            task.assignTo = assignTo;
        }

        if (project) {
            const projectDoc = await Project.findOne({ _id: project, user: req.user.userId });
            if (!projectDoc) {
                return res.status(404).json({ success: false, message: 'Project not found for this user' });
            }
            task.project = project;
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (startDate) task.startDate = startDate;
        if (endDate !== undefined) task.endDate = endDate;
        if (priority) task.priority = priority;
        if (status) task.status = status;

        await task.save();
        const populatedTask = await Task.findById(task._id)
            .populate('assignTo', 'firstName lastName email')
            .populate('project', 'title clientName');

        res.status(200).json({ success: true, message: 'Task updated successfully', data: populatedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndDelete({ _id: id, user: req.user.userId });
        
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get tasks by employee
const getTasksByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const employee = await Employee.findOne({ _id: employeeId, userId: req.user.userId });
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found for this user' });
        }

        const tasks = await Task.find({ assignTo: employeeId, user: req.user.userId })
            .populate('assignTo', 'firstName lastName email')
            .populate('project', 'title clientName')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get tasks by project
const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findOne({ _id: projectId, user: req.user.userId });
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found for this user' });
        }

        const tasks = await Task.find({ project: projectId, user: req.user.userId })
            .populate('assignTo', 'firstName lastName email')
            .populate('project', 'title clientName')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get task statistics
const getTaskStats = async (req, res) => {
    try {
        const userFilter = { user: req.user.userId };
        const totalTasks = await Task.countDocuments(userFilter);
        const pendingTasks = await Task.countDocuments({ ...userFilter, status: 'Pending' });
        const inProgressTasks = await Task.countDocuments({ ...userFilter, status: 'In Progress' });
        const completedTasks = await Task.countDocuments({ ...userFilter, status: 'Completed' });
        const onHoldTasks = await Task.countDocuments({ ...userFilter, status: 'On Hold' });

        res.status(200).json({
            success: true,
            data: {
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                onHoldTasks
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByEmployee,
    getTasksByProject,
    getTaskStats
};

