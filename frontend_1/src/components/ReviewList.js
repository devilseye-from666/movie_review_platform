import React from 'react';
import ReviewCard from './ReviewCard';
import LoadingSpinner from './LoadingSpinner';

const ReviewList = ({ reviews, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner size="medium" text="Loading reviews..." />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No reviews yet.</p>
        <p className="text-gray-400 text-sm mt-2">Be the first to write a review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
