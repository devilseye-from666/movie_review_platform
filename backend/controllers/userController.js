const User = require('../models/User');
const Review = require('../models/Review');
const Movie = require('../models/Movie');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId)
      .select('-password')
      .populate('watchlist', 'title posterUrl releaseYear genre averageRating');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's review count
    const reviewCount = await Review.countDocuments({ user: userId });

    res.json({
      user,
      stats: {
        reviewCount,
        watchlistCount: user.watchlist.length,
        joinDate: user.joinDate
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user._id;

    // Check if user is updating their own profile
    if (userId !== currentUserId.toString()) {
      return res.status(403).json({ 
        message: 'You can only update your own profile' 
      });
    }

    const { username, profilePicture } = req.body;

    // Check if username is taken by another user
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        ...(username && { username }),
        ...(profilePicture && { profilePicture })
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const userId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const reviews = await Review.getUserReviews(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    const total = await Review.countDocuments({ user: userId });
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
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error fetching user reviews' });
  }
};

// Get user's watchlist
const getUserWatchlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user._id;

    // Check if user is accessing their own watchlist
    if (userId !== currentUserId.toString()) {
      return res.status(403).json({ 
        message: 'You can only access your own watchlist' 
      });
    }

    const user = await User.findById(userId)
      .populate({
        path: 'watchlist',
        select: 'title posterUrl releaseYear genre averageRating totalReviews synopsis director',
        options: { sort: { createdAt: -1 } }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      watchlist: user.watchlist,
      count: user.watchlist.length
    });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ message: 'Server error fetching watchlist' });
  }
};

// Add movie to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user._id;
    const { movieId } = req.body;

    // Check if user is modifying their own watchlist
    if (userId !== currentUserId.toString()) {
      return res.status(403).json({ 
        message: 'You can only modify your own watchlist' 
      });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if movie is already in watchlist
    const user = await User.findById(userId);
    if (user.watchlist.includes(movieId)) {
      return res.status(400).json({ 
        message: 'Movie is already in your watchlist' 
      });
    }

    // Add movie to watchlist
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { watchlist: movieId } },
      { new: true }
    );

    res.json({
      message: 'Movie added to watchlist successfully',
      movie: {
        _id: movie._id,
        title: movie.title,
        posterUrl: movie.posterUrl
      }
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ message: 'Server error adding to watchlist' });
  }
};

// Remove movie from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const movieId = req.params.movieId;
    const currentUserId = req.user._id;

    // Check if user is modifying their own watchlist
    if (userId !== currentUserId.toString()) {
      return res.status(403).json({ 
        message: 'You can only modify your own watchlist' 
      });
    }

    // Remove movie from watchlist
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { watchlist: movieId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Movie removed from watchlist successfully'
    });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Server error removing from watchlist' });
  }
};

// Check if movie is in user's watchlist
const checkWatchlistStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const movieId = req.params.movieId;

    const user = await User.findById(userId);
    const isInWatchlist = user.watchlist.includes(movieId);

    res.json({ isInWatchlist });
  } catch (error) {
    console.error('Check watchlist status error:', error);
    res.status(500).json({ message: 'Server error checking watchlist status' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserReviews,
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlistStatus
};