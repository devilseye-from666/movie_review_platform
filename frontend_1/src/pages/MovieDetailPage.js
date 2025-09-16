import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import WatchlistButton from '../components/WatchlistButton';
import { 
  StarIcon, 
  CalendarIcon, 
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const MovieDetailPage = () => {
  const { id } = useParams();
  const {
    currentMovie,
    reviews,
    movieLoading,
    reviewsLoading,
    error,
    success,
    clearMessages,
    fetchMovie,
    fetchReviews,
    isAuthenticated
  } = useApp();

  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMovie(id);
      fetchReviews(id);
    }
  }, [id]);

  const renderStars = (rating, size = 'h-5 w-5') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className={`${size} text-yellow-400`} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarOutlineIcon className={`${size} text-gray-300`} />
            <StarIcon className={`${size} text-yellow-400 absolute top-0 left-0 w-1/2 overflow-hidden`} />
          </div>
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className={`${size} text-gray-300`} />
        );
      }
    }
    return stars;
  };

  if (movieLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading movie..." />
      </div>
    );
  }

  if (!currentMovie && !movieLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message="Movie not found" />
      </div>
    );
  }

  if (!currentMovie) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ErrorMessage message={error} onClose={clearMessages} />
      <SuccessMessage message={success} onClose={clearMessages} />

      {/* Movie Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          {/* Movie Poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={currentMovie.posterUrl || `https://dummyimage.com/300x450/000/fff&text=No+Image`}
              alt={currentMovie.title}
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.src = "https://dummyimage.com/300x450/000/fff&text=No+Image";
              }}
            />
          </div>

          {/* Movie Info */}
          <div className="md:w-2/3 lg:w-3/4 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentMovie.title}
                </h1>
                
                {currentMovie.isFeatured && (
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                    Featured Movie
                  </span>
                )}
              </div>
              
              {isAuthenticated && (
                <WatchlistButton movieId={currentMovie._id} />
              )}
            </div>

            {/* Movie Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{currentMovie.releaseYear}</span>
              </div>
              
              {currentMovie.runtime && (
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{currentMovie.runtime} min</span>
                </div>
              )}
              
              <div className="flex items-center text-gray-600">
                <UserIcon className="h-5 w-5 mr-2" />
                <span>{currentMovie.director}</span>
              </div>
              
              <div className="text-gray-600">
                <span className="font-medium">Language:</span> {currentMovie.language || 'English'}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                {renderStars(currentMovie.averageRating || 0)}
              </div>
              <span className="text-2xl font-bold text-gray-900 mr-2">
                {currentMovie.averageRating ? currentMovie.averageRating.toFixed(1) : '0.0'}
              </span>
              <span className="text-gray-600">
                ({currentMovie.totalReviews || 0} reviews)
              </span>
            </div>

            {/* Genres */}
            {currentMovie.genre && currentMovie.genre.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {currentMovie.genre.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synopsis */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Synopsis</h3>
              <p className="text-gray-700 leading-relaxed">{currentMovie.synopsis}</p>
            </div>

            {/* Cast */}
            {currentMovie.cast && currentMovie.cast.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cast</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentMovie.cast.slice(0, 8).map((actor, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-medium">{actor.name}</span>
                      {actor.character && (
                        <span className="text-gray-600">as {actor.character}</span>
                      )}
                    </div>
                  ))}
                </div>
                {currentMovie.cast.length > 8 && (
                  <p className="text-sm text-gray-500 mt-2">
                    and {currentMovie.cast.length - 8} more...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Reviews ({currentMovie.totalReviews || 0})
          </h2>
          
          {isAuthenticated && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showReviewForm ? 'Cancel' : 'Write Review'}
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && isAuthenticated && (
          <div className="mb-8">
            <ReviewForm
              movieId={currentMovie._id}
              onSuccess={() => {
                setShowReviewForm(false);
                fetchReviews(currentMovie._id);
                fetchMovie(currentMovie._id); // Refresh movie to update rating
              }}
            />
          </div>
        )}

        {/* Reviews List */}
        <ReviewList 
          reviews={reviews}
          loading={reviewsLoading}
        />
      </div>
    </div>
  );
};

export default MovieDetailPage;