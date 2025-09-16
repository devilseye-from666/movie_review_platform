const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  getUserReviews,
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlistStatus
} = require('../controllers/userController');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Profile update validation
const updateProfileValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('profilePicture')
    .optional()
    .isURL()
    .withMessage('Profile picture must be a valid URL')
];

// Watchlist validation
const watchlistValidation = [
  body('movieId')
    .isMongoId()
    .withMessage('Invalid movie ID')
];

// Pagination validation
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

// Routes
router.get('/:id', getUserProfile);
router.put('/:id', auth, updateProfileValidation, handleValidationErrors, updateUserProfile);
router.get('/:id/reviews', paginationValidation, handleValidationErrors, getUserReviews);
router.get('/:id/watchlist', auth, getUserWatchlist);
router.post('/:id/watchlist', auth, watchlistValidation, handleValidationErrors, addToWatchlist);
router.delete('/:id/watchlist/:movieId', auth, removeFromWatchlist);
router.get('/watchlist/check/:movieId', auth, checkWatchlistStatus);

module.exports = router;