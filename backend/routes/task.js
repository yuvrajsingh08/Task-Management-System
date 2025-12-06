const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByEmployee,
    getTasksByProject,
    getTaskStats
} = require('../controllers/taskController');

// Protect all task routes
router.use(authMiddleware);

// Get all tasks
router.get('/tasks', getAllTasks);

// Get task statistics
router.get('/tasks/stats', getTaskStats);

// Get task by ID
router.get('/task/:id', getTaskById);

// Get tasks by employee
router.get('/tasks/employee/:employeeId', getTasksByEmployee);

// Get tasks by project
router.get('/tasks/project/:projectId', getTasksByProject);

// Create new task
router.post('/task', createTask);

// Update task
router.put('/task/:id', updateTask);

// Delete task
router.delete('/task/:id', deleteTask);

module.exports = router;