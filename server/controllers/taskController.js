const Task = require('../models/Task');
const {
  applyTaskCompletionRewards,
  VALID_CATEGORIES,
  VALID_DIFFICULTIES,
} = require('../utils/rpgEngine');
const { formatUser } = require('./authController');

// @route GET /api/tasks
// Returns only the logged-in user's tasks - this is the core
// "users can only see their own data" security requirement.
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort('-createdAt');
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, category, difficulty } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title cannot be empty' });
    }
    if (category && !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` });
    }
    if (difficulty && !VALID_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({ message: `Difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}` });
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category || 'other',
      difficulty: difficulty || 'medium',
    });

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/tasks/:id
// Only edits tasks owned by the logged-in user.
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, category, difficulty } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: 'Task title cannot be empty' });
      }
      task.title = title.trim();
    }
    if (description !== undefined) task.description = description.trim();
    if (category !== undefined) {
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` });
      }
      task.category = category;
    }
    if (difficulty !== undefined) {
      if (!VALID_DIFFICULTIES.includes(difficulty)) {
        return res.status(400).json({ message: `Difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}` });
      }
      task.difficulty = difficulty;
    }

    await task.save();
    res.json({ task });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted', taskId: req.params.id });
  } catch (err) {
    next(err);
  }
};

// @route PATCH /api/tasks/:id/complete
// The heart of the game: marks a task done and runs the RPG reward
// engine (XP, gold, attributes, streaks, level-up check).
const completeTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.completed) {
      return res.status(400).json({ message: 'Task is already completed' });
    }

    task.completed = true;
    task.completedAt = new Date();

    // req.user is a live Mongoose doc from the `protect` middleware -
    // this mutates it in memory, then we persist below.
    const rewardSummary = applyTaskCompletionRewards(req.user, task);

    await task.save();
    await req.user.save();

    res.json({
      task,
      rewards: rewardSummary,
      user: formatUser(req.user),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, completeTask };
