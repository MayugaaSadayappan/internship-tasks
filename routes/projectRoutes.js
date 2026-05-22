const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createProject, getProjects } = require('../controllers/projectController');
const { createTask, getTasksByProject, updateTaskStatus } = require('../controllers/taskController');

// Project Endpoints
router.post('/projects', auth, createProject);
router.get('/projects', auth, getProjects);

// Task Endpoints
router.post('/tasks', auth, createTask);
router.get('/tasks/:projectId', auth, getTasksByProject);
router.put('/tasks/:taskId', auth, updateTaskStatus); // Status update trigger path

module.exports = router;