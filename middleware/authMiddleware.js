const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Get token from request header
  const token = req.header('Authorization');

  // 2. Check if no token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 3. Verify token (Example format: "Bearer <token_string>")
    const tokenString = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
    
    // 4. Add user id from payload to request object
    req.user = decoded;
    
    next(); // Everything is fine, move to next controller function
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};