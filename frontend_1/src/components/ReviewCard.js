import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { UserIcon } from '@heroicons/react/24/outline';

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {review.user?.profilePicture ? (
              <img
                src={review.user.profilePicture}
                alt={review.user.username}
                className="h-10 w-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div className="h-10 w-10 bg-gray-100 rounded-full items-center justify-center" style={{display: 'none'}}>
              <UserIcon className="h-6 w-6 text-gray-400" />
            </div>
          </div>

          {/* User Info */}
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {review.user?.username || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            {renderStars(review.rating)}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {review.rating}/5
          </span>
        </div>
      </div>

      {/* Review Text */}
      <div className="text-gray-700 leading-relaxed">
        <p>{review.reviewText}</p>
      </div>

      {/* Review Actions (placeholder for future features like helpful votes) */}
      {review.helpfulVotes > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {review.helpfulVotes} people found this review helpful
          </span>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;