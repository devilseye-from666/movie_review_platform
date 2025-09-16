import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from './LoadingSpinner';

const ReviewForm = ({ movieId, onSuccess }) => {
  const { addReview, loading } = useApp();
  const [formData, setFormData] = useState({
    rating: 0,
    reviewText: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (formData.reviewText.trim().length < 10) {
      alert('Review must be at least 10 characters long');
      return;
    }

    const result = await addReview(movieId, formData);
    if (result.success) {
      setFormData({ rating: 0, reviewText: '' });
      if (onSuccess) onSuccess();
    }
  };

  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredRating || formData.rating);
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none"
        >
          {isFilled ? (
            <StarSolidIcon className="h-8 w-8 text-yellow-400 hover:text-yellow-500" />
          ) : (
            <StarOutlineIcon className="h-8 w-8 text-gray-300 hover:text-yellow-400" />
          )}
        </button>
      );
    }
    return stars;
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h3>
      
      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating *
        </label>
        <div className="flex items-center space-x-1">
          {renderStarRating()}
          <span className="ml-2 text-sm text-gray-600">
            {formData.rating > 0 && `${formData.rating} star${formData.rating > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          id="reviewText"
          rows={4}
          value={formData.reviewText}
          onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
          placeholder="Share your thoughts about this movie..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          maxLength={1000}
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {formData.reviewText.length}/1000 characters
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || formData.rating === 0 || formData.reviewText.trim().length < 10}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <>
              <LoadingSpinner size="small" />
              <span className="ml-2">Submitting...</span>
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;