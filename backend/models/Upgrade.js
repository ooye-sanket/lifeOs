const mongoose = require('mongoose');

const upgradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['New Mindset', 'New Habit', 'New Skill', 'New Body', 'New Life', 'New You'],
    required: true,
  },
  duration: {
    type: Number, // in days
    required: true,
  },
  meaning: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  dailyLogs: [{
    date: Date,
    status: {
      type: String,
      enum: ['Did something', 'Did a little', 'Did nothing'],
    },
    note: String,
  }],
  active: {
    type: Boolean,
    default: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Upgrade', upgradeSchema);