const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Local Runtime Memory Array (Works like an instant database in RAM!)
const localUsersMockDB = [];

// 1. REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists in local memory
    const userExists = localUsersMockDB.find(u => u.email === email);
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save into local memory array
    const newUser = { _id: Date.now().toString(), name, email, password: hashedPassword };
    localUsersMockDB.push(newUser);

    res.status(201).json({ message: 'User registered successfully inside sandbox!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user from memory array
    const user = localUsersMockDB.find(u => u.email === email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};