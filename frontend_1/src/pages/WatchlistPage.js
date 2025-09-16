import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { BookmarkIcon, FilmIcon } from '@heroicons/react/24/outline';

const WatchlistPage = () => {
  const { 
    watchlist, 
    watchlistLoading, 
    error, 
    clearMessages,
    fetchWatchlist,
    user 
  } = useApp();

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  if (watchlistLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading your watchlist..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ErrorMessage message={error} onClose={clearMessages} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <BookmarkIcon className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">My Watchlist</h1>
        </div>
        <p className="text-gray-600">
          Movies you've saved to watch later. {watchlist?.length || 0} movies in your watchlist.
        </p>
      </div>

      {/* Watchlist Content */}
      {watchlist && watchlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {watchlist.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <BookmarkIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your watchlist is empty</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Discover great movies and add them to your watchlist so you never forget what you want to watch next.
          </p>
          <Link
            to="/movies"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FilmIcon className="h-5 w-5 mr-2" />
            Browse Movies
          </Link>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;