const { formatUser } = require('./authController');

// @route GET /api/users/me
// Same shape as /api/auth/me - kept as a separate resource so the
// frontend can conceptually think of "user profile" vs "auth session"
// as different concerns, even though they share an implementation.
const getProfile = async (req, res, next) => {
  try {
    await req.user.populate('inventory');
    res.json({ user: formatUser(req.user) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile };
