const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  role:       { type: String, enum: ['super_admin', 'admin', 'editor', 'user'], default: 'user' },
  profile: {
    bio: String,
    contact: String,
    language: String
  },
  banned: {
    status:   { type: Boolean, default: false },
    reason:   String,
    until:    Date,
    history:  [{ reason: String, until: Date, actionBy: String, date: Date }]
  },
  activityLog: [{ action: String, targetId: String, timestamp: Date }],
  notifications: [{ message: String, read: { type: Boolean, default: false }, createdAt: Date }],
  createdAt: { type: Date, default: Date.now },
  deleted:   { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);