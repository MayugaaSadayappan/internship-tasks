const Project = require('../models/Project');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    // req.user.id varrathu namma authMiddleware moolama
    const newProject = new Project({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id] // Creator-ah default-ah member-ah add பண்றோம்
    });
    const project = await newProject.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all projects for logged-in user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id }).populate('createdBy', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};