const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// GET all users (admin only)
router.get('/', auth, roles(['super_admin', 'admin']), async (req, res) => {
  const users = await User.find({ deleted: false });
  res.json(users);
});

// Get own profile/activity log
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// Get user profile by id
router.get('/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.deleted) return res.status(404).send('User not found');
  res.json(user);
});

// Add user (admin only)
router.post('/add', auth, roles(['super_admin', 'admin']), async (req, res) => {
  // Similar to signup; hash password, check uniqueness, assign role
});

// Edit user profile
router.put('/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.deleted) return res.status(404).send('User not found');
  // Only admins or self can edit
  if (req.user.role === 'user' && req.user._id.toString() !== user._id.toString())
    return res.status(403).send('Forbidden');
  Object.assign(user.profile, req.body.profile || {});
  await user.save();
  res.send('Profile updated');
});

// Delete user (soft delete)
router.delete('/:id', auth, roles(['super_admin', 'admin']), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.deleted) return res.status(404).send('User not found');
  user.deleted = true;
  await user.save();
  res.send('User deleted');
});

// Ban user
router.post('/:id/ban', auth, roles(['super_admin', 'admin']), async (req, res) => {
  const { reason, until } = req.body;
  const user = await User.findById(req.params.id);
  if (!user || user.deleted) return res.status(404).send('User not found');
  user.banned = { status: true, reason, until, history: [...user.banned.history, { reason, until, actionBy: req.user.username, date: new Date() }]};
  user.notifications.push({ message: `You have been banned: ${reason} until ${until}`, createdAt: new Date() });
  await user.save();
  res.send('User banned');
});

// Unban user
router.post('/:id/unban', auth, roles(['super_admin', 'admin']), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.deleted) return res.status(404).send('User not found');
  user.banned.status = false;
  user.banned.reason = '';
  user.banned.until = null;
  await user.save();
  res.send('User unbanned');
});

// Role change
router.post('/:id/role', auth, roles(['super_admin']), async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user || user.deleted) return res.status(404).send('User not found');
  user.role = role;
  await user.save();
  res.send('Role updated');
});

module.exports = router;