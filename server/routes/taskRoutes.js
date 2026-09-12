const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Every task route requires a logged-in user.
router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/complete', completeTask);

module.exports = router;
