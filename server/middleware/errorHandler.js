// Centralized error handler. Any error passed to next(err), or thrown
// inside an async route wrapped in a try/catch that calls next(err),
// ends up here instead of crashing the server or leaking stack traces.
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Mongoose duplicate key error (e.g., email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} is already in use` });
  }

  // Invalid ObjectId format
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Something went wrong on the server',
  });
};

// Catches requests to routes that don't exist.
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
