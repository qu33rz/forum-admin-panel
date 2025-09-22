const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content:   String,
  createdAt: { type: Date, default: Date.now },
  flagged:   { status: Boolean, reason: String, flaggedBy: mongoose.Schema.Types.ObjectId },
  deleted:   { type: Boolean, default: false }
});

const postSchema = new mongoose.Schema({
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title:       { type: String, required: true },
  content:     { type: String, required: true },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   Date,
  flagged: {
    status:   { type: Boolean, default: false },
    reason:   String,
    flaggedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  deleted:     { type: Boolean, default: false },
  deletedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  replies:     [replySchema],
});

module.exports = mongoose.model('Post', postSchema);