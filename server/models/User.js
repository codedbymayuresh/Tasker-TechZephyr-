const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never return password by default on queries
    },

    // --- Progression ---
    xp: { type: Number, default: 0, min: 0 },
    gold: { type: Number, default: 0, min: 0 },

    // --- Character attributes, each fed by a category of task ---
    attributes: {
      strength: { type: Number, default: 0 },
      intellect: { type: Number, default: 0 },
      wisdom: { type: Number, default: 0 },
      discipline: { type: Number, default: 0 },
      charisma: { type: Number, default: 0 },
    },

    // --- Streak tracking ---
    streak: {
      count: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastCompletedDate: { type: Date, default: null },
    },

    // --- Shop / economy ---
    inventory: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
