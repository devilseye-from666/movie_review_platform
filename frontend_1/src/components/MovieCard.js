import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const MovieCard = ({ movie }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarOutlineIcon className="h-4 w-4 text-gray-300" />
            <StarIcon className="h-4 w-4 text-yellow-400 absolute top-0 left-0 w-1/2 overflow-hidden" />
          </div>
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <Link to={`/movies/${movie._id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-w-2 aspect-h-3 relative overflow-hidden">
          <img
            src={movie.posterUrl || `https://dummyimage.com/300x450/000/fff&text=No+Image` }
            alt={movie.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://dummyimage.com/300x450/000/fff&text=No+Image';
            }}
          />
          {movie.isFeatured && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center mb-2">
            <CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{movie.releaseYear}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                {renderStars(movie.averageRating || 0)}
              </div>
              <span className="text-sm text-gray-600">
                {movie.averageRating ? movie.averageRating.toFixed(1) : '0.0'}
              </span>
            </div>
            
            <span className="text-xs text-gray-500">
              {movie.totalReviews || 0} reviews
            </span>
          </div>
          
          {movie.genre && movie.genre.length > 0 && (
            <div className="mt-2">
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {movie.genre[0]}
              </span>
              {movie.genre.length > 1 && (
                <span className="text-xs text-gray-500 ml-1">
                  +{movie.genre.length - 1} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;