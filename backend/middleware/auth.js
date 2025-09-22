const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user || user.deleted) return res.status(401).send('User not found.');
    if (user.banned.status && (!user.banned.until || user.banned.until > new Date())) 
      return res.status(403).send(`Banned: ${user.banned.reason} until ${user.banned.until}`);
    req.user = user;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};