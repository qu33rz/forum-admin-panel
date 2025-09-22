const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// Get prominent topics (public)
router.get('/topics', async (req, res) => {
  const posts = await Post.find({ deleted: false }).sort({ createdAt: -1 }).limit(10);
  res.json(posts);
});

// Get full topic details (logged-in)
router.get('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.deleted) return res.status(404).send('Not found.');
  res.json(post);
});

// Create post (logged-in)
router.post('/create', auth, async (req, res) => {
  const post = new Post({ ...req.body, author: req.user._id });
  await post.save();
  req.user.activityLog.push({ action: 'create_post', targetId: post._id, timestamp: new Date() });
  await req.user.save();
  res.send('Post created');
});

// Edit post
router.put('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.deleted) return res.status(404).send('Not found.');
  // Only author or admin
  if (req.user.role === 'user' && post.author.toString() !== req.user._id.toString())
    return res.status(403).send('Forbidden');
  Object.assign(post, req.body);
  post.updatedAt = new Date();
  await post.save();
  req.user.activityLog.push({ action: 'edit_post', targetId: post._id, timestamp: new Date() });
  await req.user.save();
  res.send('Post updated');
});

// Delete post (soft delete)
router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.deleted) return res.status(404).send('Not found.');
  // Only author or admin
  if (req.user.role === 'user' && post.author.toString() !== req.user._id.toString())
    return res.status(403).send('Forbidden');
  post.deleted = true;
  post.deletedBy = req.user._id;
  await post.save();
  req.user.activityLog.push({ action: 'delete_post', targetId: post._id, timestamp: new Date() });
  await req.user.save();
  res.send('Post deleted');
});

// Flag post
router.post('/:id/flag', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.deleted) return res.status(404).send('Not found.');
  post.flagged = { status: true, reason: req.body.reason, flaggedBy: req.user._id };
  await post.save();
  req.user.activityLog.push({ action: 'flag_post', targetId: post._id, timestamp: new Date() });
  await req.user.save();
  res.send('Post flagged');
});

// Reply to post (logged-in)
router.post('/:id/reply', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.deleted) return res.status(404).send('Not found.');
  post.replies.push({ author: req.user._id, content: req.body.content, createdAt: new Date() });
  await post.save();
  req.user.activityLog.push({ action: 'reply', targetId: post._id, timestamp: new Date() });
  await req.user.save();
  res.send('Reply added');
});

// Flag reply
router.post('/:id/replies/:replyId/flag', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  const reply = post.replies.id(req.params.replyId);
  if (!reply) return res.status(404).send('Reply not found');
  reply.flagged = { status: true, reason: req.body.reason, flaggedBy: req.user._id };
  await post.save();
  req.user.activityLog.push({ action: 'flag_reply', targetId: req.params.replyId, timestamp: new Date() });
  await req.user.save();
  res.send('Reply flagged');
});

// Moderate flagged posts (admin only)
router.get('/flagged', auth, roles(['super_admin', 'admin']), async (req, res) => {
  const posts = await Post.find({ 'flagged.status': true, deleted: false });
  res.json(posts);
});
// Moderate flagged replies (admin only)
router.get('/flagged-replies', auth, roles(['super_admin', 'admin']), async (req, res) => {
  const posts = await Post.find({ 'replies.flagged.status': true, deleted: false });
  const flaggedReplies = posts.flatMap(post => post.replies.filter(r => r.flagged?.status).map(r => ({ postId: post._id, ...r._doc })));
  res.json(flaggedReplies);
});

// Admin can delete/restore flagged posts or replies
router.post('/:id/restore', auth, roles(['super_admin', 'admin']), async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send('Not found.');
  post.deleted = false;
  await post.save();
  res.send('Post restored');
});
router.post('/:id/replies/:replyId/restore', auth, roles(['super_admin', 'admin']), async (req, res) => {
  const post = await Post.findById(req.params.id);
  const reply = post.replies.id(req.params.replyId);
  if (!reply) return res.status(404).send('Reply not found');
  reply.deleted = false;
  await post.save();
  res.send('Reply restored');
});

module.exports = router;