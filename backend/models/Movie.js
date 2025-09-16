const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  genre: {
    type: [String],
    required: [true, 'At least one genre is required'],
    enum: [
      'Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy',
      'Historical', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
      'Western', 'Animation', 'Documentary', 'Musical', 'War', 'Biography'
    ]
  },
  releaseYear: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1888, 'Release year cannot be before 1888'],
    max: [new Date().getFullYear() + 2, 'Release year cannot be more than 2 years in the future']
  },
  director: {
    type: String,
    required: [true, 'Director is required'],
    trim: true,
    maxlength: [100, 'Director name cannot exceed 100 characters']
  },
  cast: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    character: {
      type: String,
      trim: true
    }
  }],
  synopsis: {
    type: String,
    required: [true, 'Synopsis is required'],
    trim: true,
    maxlength: [2000, 'Synopsis cannot exceed 2000 characters']
  },
  posterUrl: {
    type: String,
    default: 'https://dummyimage.com/300x450/000/fff&text=No+Image'
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  runtime: {
    type: Number, // in minutes
    min: [1, 'Runtime must be at least 1 minute']
  },
  language: {
    type: String,
    default: 'English'
  },
  country: {
    type: String,
    default: 'USA'
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalRating: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate average rating
movieSchema.methods.calculateAverageRating = function() {
  if (this.totalReviews === 0) {
    this.averageRating = 0;
  } else {
    this.averageRating = Number((this.totalRating / this.totalReviews).toFixed(1));
  }
};

// Update rating when review is added
movieSchema.methods.addReview = function(rating) {
  this.totalReviews += 1;
  this.totalRating += rating;
  this.calculateAverageRating();
  return this.save();
};

// Update rating when review is removed
movieSchema.methods.removeReview = function(rating) {
  if (this.totalReviews > 0) {
    this.totalReviews -= 1;
    this.totalRating -= rating;
    this.calculateAverageRating();
  }
  return this.save();
};

// Update rating when review is modified
movieSchema.methods.updateReview = function(oldRating, newRating) {
  this.totalRating = this.totalRating - oldRating + newRating;
  this.calculateAverageRating();
  return this.save();
};

// Index for search functionality
movieSchema.index({
  title: 'text',
  synopsis: 'text',
  director: 'text',
  'cast.name': 'text'
});

// Index for filtering
movieSchema.index({ genre: 1, releaseYear: 1, averageRating: 1 });
movieSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Movie', movieSchema);