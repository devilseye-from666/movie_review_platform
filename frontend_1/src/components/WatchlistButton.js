import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from './LoadingSpinner';

const WatchlistButton = ({ movieId }) => {
  const { 
    watchlist, 
    addToWatchlist, 
    removeFromWatchlist,
    fetchWatchlist,
    user,
    isAuthenticated
  } = useApp();
  
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && movieId) {
      fetchWatchlist();
    }
  }, [isAuthenticated, user, movieId]);

  useEffect(() => {
    if (watchlist && movieId) {
      const inWatchlist = watchlist.some(movie => movie._id === movieId);
      setIsInWatchlist(inWatchlist);
    }
  }, [watchlist, movieId]);

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(movieId);
      } else {
        await addToWatchlist(movieId);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={handleWatchlistToggle}
      disabled={loading}
      className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
        isInWatchlist
          ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <LoadingSpinner size="small" />
      ) : isInWatchlist ? (
        <BookmarkSolidIcon className="h-5 w-5 mr-2" />
      ) : (
        <BookmarkOutlineIcon className="h-5 w-5 mr-2" />
      )}
      <span className="text-sm font-medium">
        {loading ? 'Updating...' : isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
      </span>
    </button>
  );
};

export default WatchlistButton;