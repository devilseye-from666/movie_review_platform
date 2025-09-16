import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import ReviewCard from '../components/ReviewCard';
import MovieCard from '../components/MovieCard';
import { 
  UserIcon, 
  PencilIcon,
  StarIcon,
  BookmarkIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { 
    user, 
    userReviews, 
    watchlist, 
    loading, 
    error, 
    success, 
    clearMessages,
    fetchWatchlist
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    profilePicture: user?.profilePicture || ''
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.username,
        profilePicture: user.profilePicture || ''
      });
      fetchWatchlist();
    }
  }, [user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // This would integrate with the updateProfile action
    // For now, just close the edit form
    setIsEditing(false);
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ErrorMessage message={error} onClose={clearMessages} />
      <SuccessMessage message={success} onClose={clearMessages} />

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            {/* Profile Picture */}
            <div className="relative">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  <UserIcon className="h-10 w-10 text-gray-400" />
                </div>
              )}
              <div className="h-20 w-20 bg-gray-100 rounded-full items-center justify-center border-4 border-white shadow-md" style={{display: 'none'}}>
                <UserIcon className="h-10 w-10 text-gray-400" />
              </div>
            </div>

            {/* User Info */}
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>Joined {formatJoinDate(user.joinDate)}</span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleEditSubmit} className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  value={editForm.profilePicture}
                  onChange={(e) => setEditForm({ ...editForm, profilePicture: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://dummyimage.com/150x150/000/fff&text=User"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <StarIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{userReviews?.length || 0}</div>
          <div className="text-sm text-gray-600">Reviews Written</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
            <BookmarkIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{watchlist?.length || 0}</div>
          <div className="text-sm text-gray-600">Movies in Watchlist</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <CalendarIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="text-sm text-gray-600">Days as Member</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'reviews', label: `Reviews (${userReviews?.length || 0})` },
              { key: 'watchlist', label: `Watchlist (${watchlist?.length || 0})` }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              {userReviews && userReviews.length > 0 ? (
                <div className="space-y-4">
                  {userReviews.slice(0, 3).map((review) => (
                    <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                      <ReviewCard review={review} />
                    </div>
                  ))}
                  {userReviews.length > 3 && (
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View all {userReviews.length} reviews →
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet. Start watching and reviewing movies!</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {userReviews && userReviews.length > 0 ? (
                <div className="space-y-6">
                  {userReviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No reviews yet</p>
                  <p className="text-gray-400 text-sm">Start watching movies and share your thoughts!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div>
              {watchlist && watchlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {watchlist.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookmarkIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your watchlist is empty</p>
                  <p className="text-gray-400 text-sm">Add movies you want to watch later!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;