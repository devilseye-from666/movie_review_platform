const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  isRecommended: {
    type: Boolean,
    default: true
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  votedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    helpful: {
      type: Boolean,
      default: true
    }
  }]
}, {
  timestamps: true
});

// Ensure user can only review a movie once
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

// Index for sorting reviews
reviewSchema.index({ movie: 1, createdAt: -1 });
reviewSchema.index({ movie: 1, helpfulVotes: -1 });

// Populate user info when querying reviews
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username profilePicture joinDate'
  });
  next();
});

// Method to check if review is recommended
reviewSchema.methods.getRecommendation = function() {
  return this.rating >= 3 ? true : false;
};

// Static method to get movie reviews with pagination
reviewSchema.statics.getMovieReviews = function(movieId, page = 1, limit = 10, sortBy = 'newest') {
  const skip = (page - 1) * limit;
  
  let sortOption = { createdAt: -1 }; // newest first (default)
  
  switch (sortBy) {
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'highest':
      sortOption = { rating: -1, createdAt: -1 };
      break;
    case 'lowest':
      sortOption = { rating: 1, createdAt: -1 };
      break;
    case 'helpful':
      sortOption = { helpfulVotes: -1, createdAt: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }
  
  return this.find({ movie: movieId })
    .sort(sortOption)
    .skip(skip)
    .limit(limit);
};

// Static method to get user reviews
reviewSchema.statics.getUserReviews = function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({ user: userId })
    .populate({
      path: 'movie',
      select: 'title posterUrl releaseYear genre'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model('Review', reviewSchema);