const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { auth, optionalAuth, adminAuth } = require('../middleware/auth');
const {
  getMovies,
  getFeaturedMovies,
  getMovie,
  addMovie,
  getMovieReviews,
  addReview
} = require('../controllers/movieController');

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

// Movie validation
const movieValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('genre')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  body('releaseYear')
    .isInt({ min: 1888, max: new Date().getFullYear() + 2 })
    .withMessage('Please provide a valid release year'),
  body('director')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Director name must be between 1 and 100 characters'),
  body('synopsis')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Synopsis must be between 10 and 2000 characters'),
  body('posterUrl')
    .optional()
    .isURL()
    .withMessage('Poster URL must be a valid URL'),
  body('trailerUrl')
    .optional()
    .isURL()
    .withMessage('Trailer URL must be a valid URL'),
  body('runtime')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Runtime must be a positive number'),
  body('cast')
    .optional()
    .isArray()
    .withMessage('Cast must be an array'),
  body('cast.*.name')
    .if(body('cast').exists())
    .trim()
    .notEmpty()
    .withMessage('Cast member name is required')
];

// Review validation
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review text must be between 10 and 1000 characters')
];

// Query validation for get movies
const getMoviesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('minRating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Min rating must be between 0 and 5'),
  query('maxRating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Max rating must be between 0 and 5'),
  query('year')
    .optional()
    .custom((value) => {
      if (value === 'all') return true;
      const year = parseInt(value);
      return year >= 1888 && year <= new Date().getFullYear() + 2;
    })
    .withMessage('Year must be valid or "all"'),
  query('sortBy')
    .optional()
    .isIn(['newest', 'oldest', 'title', 'year-desc', 'year-asc', 'rating-desc', 'rating-asc', 'popular'])
    .withMessage('Invalid sort option')
];

// Routes
router.get('/', getMoviesValidation, handleValidationErrors, optionalAuth, getMovies);
router.get('/featured', getFeaturedMovies);
router.get('/:id', optionalAuth, getMovie);
router.post('/', auth, adminAuth, movieValidation, handleValidationErrors, addMovie);
router.get('/:id/reviews', getMovieReviews);
router.post('/:id/reviews', auth, reviewValidation, handleValidationErrors, addReview);

module.exports = router;