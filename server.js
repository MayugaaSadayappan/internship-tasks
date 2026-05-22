const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Enable Real-time WebSockets integration
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST", "PUT"] }
});

app.use(cors());
app.use(express.json());

// In-Memory Database Engine Sandbox to avoid Local MongoDB crashes
let usersMockDB = [];
let projectsDB = [];
let tasksDB = [];

// Mock Auth Controllers
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  usersMockDB.push({ _id: Date.now().toString(), name, email, password });
  res.status(201).json({ message: "User Registered Successfully!" });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = usersMockDB.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ message: "Invalid email or password" });
  res.json({ token: "mock-jwt-token-xyz123", user: { id: user._id, name: user.name, email: user.email } });
});

// Mock Project Drivers
app.get('/api/projects', (req, res) => res.json(projectsDB));
app.post('/api/projects', (req, res) => {
  const newProject = { _id: Date.now().toString(), ...req.body };
  projectsDB.push(newProject);
  res.status(201).json(newProject);
});

// Mock Kanban Tasks Controllers
app.get('/api/tasks/:projectId', (req, res) => {
  const filtered = tasksDB.filter(t => t.project === req.params.projectId);
  res.json(filtered);
});
app.post('/api/tasks', (req, res) => {
  const newTask = { _id: Date.now().toString(), status: 'To-Do', ...req.body };
  tasksDB.push(newTask);
  res.status(201).json(newTask);
});
app.put('/api/tasks/:taskId', (req, res) => {
  const task = tasksDB.find(t => t._id === req.params.taskId);
  if (task) task.status = req.body.status;
  res.json(task);
});

// WS Pipeline Connections
io.on('connection', (socket) => {
  socket.on('task_moved', (data) => {
    io.emit('update_board', data);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Mock Engine Server active on port ${PORT}`));