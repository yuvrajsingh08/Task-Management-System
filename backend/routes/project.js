const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectStats
} = require('../controllers/projectController');

// Protect all project routes
router.use(authMiddleware);

// Get all projects
router.get('/projects', getAllProjects);

// Get project statistics
router.get('/projects/stats', getProjectStats);

// Get project by ID
router.get('/project/:id', getProjectById);

// Create new project
router.post('/project', createProject);

// Update project
router.put('/project/:id', updateProject);

// Delete project
router.delete('/project/:id', deleteProject);

module.exports = router;