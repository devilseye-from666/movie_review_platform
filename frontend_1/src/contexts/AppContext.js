import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial State
const initialState = {
  // User State
  user: null,
  isAuthenticated: false,
  
  // Movies State
  movies: [],
  featuredMovies: [],
  currentMovie: null,
  movieLoading: false,
  
  // Reviews State
  reviews: [],
  userReviews: [],
  reviewsLoading: false,
  
  // Watchlist State
  watchlist: [],
  watchlistLoading: false,
  
  // UI State
  searchQuery: '',
  filters: {
    genre: 'all',
    year: 'all',
    minRating: 0,
    maxRating: 5,
    sortBy: 'newest'
  },
  loading: false,
  error: null,
  success: null
};

// Action Types
const actionTypes = {
  // User Actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS: 'SET_SUCCESS',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  
  // Movie Actions
  SET_MOVIES: 'SET_MOVIES',
  SET_FEATURED_MOVIES: 'SET_FEATURED_MOVIES',
  SET_CURRENT_MOVIE: 'SET_CURRENT_MOVIE',
  SET_MOVIE_LOADING: 'SET_MOVIE_LOADING',
  
  // Review Actions
  SET_REVIEWS: 'SET_REVIEWS',
  ADD_REVIEW: 'ADD_REVIEW',
  SET_REVIEWS_LOADING: 'SET_REVIEWS_LOADING',
  SET_USER_REVIEWS: 'SET_USER_REVIEWS',
  
  // Watchlist Actions
  SET_WATCHLIST: 'SET_WATCHLIST',
  SET_WATCHLIST_LOADING: 'SET_WATCHLIST_LOADING',
  ADD_TO_WATCHLIST: 'ADD_TO_WATCHLIST',
  REMOVE_FROM_WATCHLIST: 'REMOVE_FROM_WATCHLIST',
  
  // UI Actions
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_FILTERS: 'SET_FILTERS'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_SUCCESS:
      return { ...state, success: action.payload, loading: false };
    
    case actionTypes.CLEAR_MESSAGES:
      return { ...state, error: null, success: null };
    
    case actionTypes.LOGIN_SUCCESS:
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true, 
        error: null,
        loading: false 
      };
    
    case actionTypes.LOGOUT:
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        watchlist: [],
        userReviews: []
      };
    
    case actionTypes.SET_MOVIES:
      return { ...state, movies: action.payload, movieLoading: false };
    
    case actionTypes.SET_FEATURED_MOVIES:
      return { ...state, featuredMovies: action.payload };
    
    case actionTypes.SET_CURRENT_MOVIE:
      return { ...state, currentMovie: action.payload, movieLoading: false };
    
    case actionTypes.SET_MOVIE_LOADING:
      return { ...state, movieLoading: action.payload };
    
    case actionTypes.SET_REVIEWS:
      return { ...state, reviews: action.payload, reviewsLoading: false };
    
    case actionTypes.ADD_REVIEW:
      return { 
        ...state, 
        reviews: [action.payload, ...state.reviews],
        currentMovie: state.currentMovie ? {
          ...state.currentMovie,
          totalReviews: state.currentMovie.totalReviews + 1,
          averageRating: action.payload.newAverageRating || state.currentMovie.averageRating
        } : state.currentMovie
      };
    
    case actionTypes.SET_REVIEWS_LOADING:
      return { ...state, reviewsLoading: action.payload };
    
    case actionTypes.SET_USER_REVIEWS:
      return { ...state, userReviews: action.payload };
    
    case actionTypes.SET_WATCHLIST:
      return { ...state, watchlist: action.payload, watchlistLoading: false };
    
    case actionTypes.SET_WATCHLIST_LOADING:
      return { ...state, watchlistLoading: action.payload };
    
    case actionTypes.ADD_TO_WATCHLIST:
      return { 
        ...state, 
        watchlist: [...state.watchlist, action.payload]
      };
    
    case actionTypes.REMOVE_FROM_WATCHLIST:
      return { 
        ...state, 
        watchlist: state.watchlist.filter(movie => movie._id !== action.payload)
      };
    
    case actionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case actionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    default:
      return state;
  }
};

// Create Context
const AppContext = createContext();

// API Base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Context Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          payload: parsedUser
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // API Helper function
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  };

  // Action Creators
  const actions = {
    // UI Actions
    setLoading: (loading) => dispatch({ type: actionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: actionTypes.SET_ERROR, payload: error }),
    setSuccess: (message) => dispatch({ type: actionTypes.SET_SUCCESS, payload: message }),
    clearMessages: () => dispatch({ type: actionTypes.CLEAR_MESSAGES }),

    // Auth Actions
    login: async (credentials) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        
        const data = await apiCall('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: data.user });
        dispatch({ type: actionTypes.SET_SUCCESS, payload: data.message });
        
        return { success: true };
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    register: async (userData) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        
        const data = await apiCall('/auth/register', {
          method: 'POST',
          body: JSON.stringify(userData),
        });
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: data.user });
        dispatch({ type: actionTypes.SET_SUCCESS, payload: data.message });
        
        return { success: true };
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: actionTypes.LOGOUT });
    },

    // Movie Actions
    fetchMovies: async (params = {}) => {
      try {
        dispatch({ type: actionTypes.SET_MOVIE_LOADING, payload: true });
        
        const queryString = new URLSearchParams({
          ...params,
          ...(state.searchQuery && { search: state.searchQuery }),
          ...state.filters
        }).toString();
        
        const data = await apiCall(`/movies?${queryString}`);
        dispatch({ type: actionTypes.SET_MOVIES, payload: data.movies });
        
        return data;
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        dispatch({ type: actionTypes.SET_MOVIE_LOADING, payload: false });
      }
    },

    fetchFeaturedMovies: async () => {
      try {
        const data = await apiCall('/movies/featured');
        dispatch({ type: actionTypes.SET_FEATURED_MOVIES, payload: data });
      } catch (error) {
        console.error('Failed to fetch featured movies:', error);
      }
    },

    fetchMovie: async (movieId) => {
      try {
        dispatch({ type: actionTypes.SET_MOVIE_LOADING, payload: true });
        
        const data = await apiCall(`/movies/${movieId}`);
        dispatch({ type: actionTypes.SET_CURRENT_MOVIE, payload: data });
        
        return data;
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        dispatch({ type: actionTypes.SET_MOVIE_LOADING, payload: false });
      }
    },

    // Review Actions
    fetchReviews: async (movieId, params = {}) => {
      try {
        dispatch({ type: actionTypes.SET_REVIEWS_LOADING, payload: true });
        
        const queryString = new URLSearchParams(params).toString();
        const data = await apiCall(`/movies/${movieId}/reviews?${queryString}`);
        
        dispatch({ type: actionTypes.SET_REVIEWS, payload: data.reviews });
        return data;
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        dispatch({ type: actionTypes.SET_REVIEWS_LOADING, payload: false });
      }
    },

    addReview: async (movieId, reviewData) => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        
        const data = await apiCall(`/movies/${movieId}/reviews`, {
          method: 'POST',
          body: JSON.stringify(reviewData),
        });
        
        dispatch({ type: actionTypes.ADD_REVIEW, payload: data.review });
        dispatch({ type: actionTypes.SET_SUCCESS, payload: data.message });
        
        return { success: true };
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    // Watchlist Actions
    fetchWatchlist: async () => {
      try {
        if (!state.user) return;
        
        dispatch({ type: actionTypes.SET_WATCHLIST_LOADING, payload: true });
        
        const data = await apiCall(`/users/${state.user.id}/watchlist`);
        dispatch({ type: actionTypes.SET_WATCHLIST, payload: data.watchlist });
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        dispatch({ type: actionTypes.SET_WATCHLIST_LOADING, payload: false });
      }
    },

    addToWatchlist: async (movieId) => {
      try {
        if (!state.user) return;
        
        const data = await apiCall(`/users/${state.user.id}/watchlist`, {
          method: 'POST',
          body: JSON.stringify({ movieId }),
        });
        
        dispatch({ type: actionTypes.ADD_TO_WATCHLIST, payload: data.movie });
        dispatch({ type: actionTypes.SET_SUCCESS, payload: data.message });
        
        return { success: true };
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return { success: false };
      }
    },

    removeFromWatchlist: async (movieId) => {
      try {
        if (!state.user) return;
        
        const data = await apiCall(`/users/${state.user.id}/watchlist/${movieId}`, {
          method: 'DELETE',
        });
        
        dispatch({ type: actionTypes.REMOVE_FROM_WATCHLIST, payload: movieId });
        dispatch({ type: actionTypes.SET_SUCCESS, payload: data.message });
        
        return { success: true };
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return { success: false };
      }
    },

    // UI Actions
    setSearchQuery: (query) => {
      dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: query });
    },

    setFilters: (filters) => {
      dispatch({ type: actionTypes.SET_FILTERS, payload: filters });
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};