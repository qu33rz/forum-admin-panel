const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initial superAdmin assignment
let superAdminCreated = false;

router.post('/signup', async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  if (await User.findOne({ username })) return res.status(409).send('Username exists');
  if (await User.findOne({ email })) return res.status(409).send('Email exists');
  const hashed = await bcrypt.hash(password, 10);
  const role = superAdminCreated ? 'user' : 'super_admin';
  if (!superAdminCreated) superAdminCreated = true;
  const user = new User({ username, email, password: hashed, firstName, lastName, role });
  await user.save();
  res.send('Account created');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || user.deleted) return res.status(400).send('Invalid credentials');
  if (!(await bcrypt.compare(password, user.password))) return res.status(400).send('Invalid credentials');
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;