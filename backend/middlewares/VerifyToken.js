const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // next(); /// delete after the production
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Assuming 'Bearer <token>' 
    // console.log(decoded);
       
    req.user = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
