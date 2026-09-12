const mongoose = require('mongoose');
const { VALID_CATEGORIES, VALID_DIFFICULTIES } = require('../utils/rpgEngine');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    category: {
      type: String,
      enum: VALID_CATEGORIES,
      default: 'other',
    },
    difficulty: {
      type: String,
      enum: VALID_DIFFICULTIES,
      default: 'medium',
    },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
