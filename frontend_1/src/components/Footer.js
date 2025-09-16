import React from 'react';
import { FilmIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <FilmIcon className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">MovieReview</span>
          </div>
          
          <div className="text-sm text-gray-400">
            © 2024 MovieReview Platform. Built for movie enthusiasts.
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>This is a demo movie review platform. All movie data is for demonstration purposes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;