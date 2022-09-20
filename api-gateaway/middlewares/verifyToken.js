const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token',
    });
  }
};
