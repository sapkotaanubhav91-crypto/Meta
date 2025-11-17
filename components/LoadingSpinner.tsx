
import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-10">
    <div className="relative">
        <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-600"></div>
        <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-purple-500 border-t-transparent shadow-md"></div>
    </div>
  </div>
);
