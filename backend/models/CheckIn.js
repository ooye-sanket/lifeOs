const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  mood: {
    type: String,
    enum: ['Low', 'Okay', 'Good'],
    required: true,
  },
  taskFeeling: {
    type: String,
    enum: ['Hard', 'Okay', 'Smooth'],
    required: true,
  },
  note: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CheckIn', checkInSchema);