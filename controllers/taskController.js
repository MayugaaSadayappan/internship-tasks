const Task = require('../models/Task');

// Create a task inside a project
exports.createTask = async (req, res) => {
  try {
    const { project, title, description, assignedTo } = req.body;
    const newTask = new Task({ project, title, description, assignedTo });
    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks for a specific project
exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Task Status (Trello drag and drop trigger backend point)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body; // Expects 'To-Do', 'In Progress', or 'Done'
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};