const Movie = require('../models/Movie');
const Review = require('../models/Review');

// Get all movies with search and filtering
const getMovies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      genre = '',
      year = '',
      minRating = 0,
      maxRating = 5,
      sortBy = 'newest'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {};

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Genre filter
    if (genre && genre !== 'all') {
      query.genre = { $in: [genre] };
    }

    // Year filter
    if (year && year !== 'all') {
      query.releaseYear = parseInt(year);
    }

    // Rating filter
    query.averageRating = {
      $gte: parseFloat(minRating),
      $lte: parseFloat(maxRating)
    };

    // Sort options
    let sortOption = { createdAt: -1 }; // newest first (default)
    
    switch (sortBy) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'title':
        sortOption = { title: 1 };
        break;
      case 'year-desc':
        sortOption = { releaseYear: -1 };
        break;
      case 'year-asc':
        sortOption = { releaseYear: 1 };
        break;
      case 'rating-desc':
        sortOption = { averageRating: -1, totalReviews: -1 };
        break;
      case 'rating-asc':
        sortOption = { averageRating: 1, totalReviews: -1 };
        break;
      case 'popular':
        sortOption = { totalReviews: -1, averageRating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Execute query
    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate('addedBy', 'username')
      .select('-totalRating'); // Hide internal rating calculation field

    // Get total count for pagination
    const total = await Movie.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      movies,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalMovies: total,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error fetching movies' });
  }
};

// Get featured movies
const getFeaturedMovies = async (req, res) => {
  try {
    const featuredMovies = await Movie.find({ isFeatured: true })
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(6)
      .select('-totalRating');

    res.json(featuredMovies);
  } catch (error) {
    console.error('Get featured movies error:', error);
    res.status(500).json({ message: 'Server error fetching featured movies' });
  }
};

// Get single movie by ID
const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('addedBy', 'username')
      .select('-totalRating');

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Get movie error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(500).json({ message: 'Server error fetching movie' });
  }
};

// Add new movie (admin only)
const addMovie = async (req, res) => {
  try {
    const movieData = {
      ...req.body,
      addedBy: req.user._id
    };

    const movie = await Movie.create(movieData);
    
    res.status(201).json({
      message: 'Movie added successfully',
      movie
    });
  } catch (error) {
    console.error('Add movie error:', error);
    res.status(500).json({ message: 'Server error adding movie' });
  }
};

// Get movie reviews
const getMovieReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'newest'
    } = req.query;

    const reviews = await Review.getMovieReviews(
      req.params.id,
      parseInt(page),
      parseInt(limit),
      sortBy
    );

    const total = await Review.countDocuments({ movie: req.params.id });
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReviews: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get movie reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

// Add review to movie
const addReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const movieId = req.params.id;
    const userId = req.user._id;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      user: userId,
      movie: movieId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this movie' 
      });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      movie: movieId,
      rating,
      reviewText
    });

    // Update movie rating
    await movie.addReview(rating);

    // Populate user info for response
    await review.populate('user', 'username profilePicture joinDate');

    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error adding review' });
  }
};

module.exports = {
  getMovies,
  getFeaturedMovies,
  getMovie,
  addMovie,
  getMovieReviews,
  addReview
};