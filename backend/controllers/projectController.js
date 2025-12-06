const Project = require('../models/projects');

// Get all projects for the logged-in user
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get project by ID
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findOne({ _id: id, user: req.user.userId });
        
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Create new project
const createProject = async (req, res) => {
    try {
        const { title, description, clientName, startDate, endDate, status, priority } = req.body;

        if (!title || !clientName || !startDate || !status || !priority) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const newProject = new Project({
            user: req.user.userId,
            title,
            description,
            clientName,
            startDate,
            endDate,
            status,
            priority
        });

        await newProject.save();
        res.status(201).json({ success: true, message: 'Project created successfully', data: newProject });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update project
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, clientName, startDate, endDate, status, priority } = req.body;

        const project = await Project.findOne({ _id: id, user: req.user.userId });
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        if (title) project.title = title;
        if (description) project.description = description;
        if (clientName) project.clientName = clientName;
        if (startDate) project.startDate = startDate;
        if (endDate !== undefined) project.endDate = endDate;
        if (status) project.status = status;
        if (priority) project.priority = priority;

        await project.save();
        res.status(200).json({ success: true, message: 'Project updated successfully', data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Delete project
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findOneAndDelete({ _id: id, user: req.user.userId });
        
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get project statistics
const getProjectStats = async (req, res) => {
    try {
        const ownerFilter = { user: req.user.userId };
        const totalProjects = await Project.countDocuments(ownerFilter);
        const onHoldProjects = await Project.countDocuments({ ...ownerFilter, status: 'On Hold' });
        const inProgressProjects = await Project.countDocuments({ ...ownerFilter, status: 'In Progress' });
        const testingProjects = await Project.countDocuments({ ...ownerFilter, status: 'Testing' });
        const completedProjects = await Project.countDocuments({ ...ownerFilter, status: 'Completed' });

        res.status(200).json({
            success: true,
            data: {
                totalProjects,
                onHoldProjects,
                inProgressProjects,
                testingProjects,
                completedProjects
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectStats
};

