import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { CrosshairIcon } from './icons/CrosshairIcon';

interface SearchFormProps {
  initialQuery: string;
  isLoading: boolean;
  onSubmit: (query: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ initialQuery, isLoading, onSubmit }) => {
  const [inputValue, setInputValue] = useState(initialQuery);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude}, ${longitude}`;
          
          if(inputValue.toLowerCase().includes(' to ')){
             // If user already typed "directions from X to Y", replace X
             const parts = inputValue.split(/ to /i);
             setInputValue(`Directions from ${locationString} to ${parts[1] || ''}`);
          } else {
             setInputValue(`Directions from ${locationString} to `);
          }
          
          setIsLocating(false);
          inputRef.current?.focus();
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocationError(`Error: ${err.message}`);
          setIsLocating(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask for anything, including directions..."
          disabled={isLoading || isLocating}
          className="w-full p-4 pl-6 pr-28 rounded-full bg-gray-800 border-2 border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-white transition-colors duration-200 disabled:opacity-50"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLoading || isLocating}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Use current location"
          >
            {isLocating ? (
              <div className="w-6 h-6 animate-spin rounded-full border-2 border-solid border-gray-400 border-t-transparent"></div>
            ) : (
              <CrosshairIcon className="w-6 h-6" />
            )}
          </button>
          <button
            type="submit"
            disabled={isLoading || isLocating || !inputValue.trim()}
            className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <SearchIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </form>
      {locationError && <p className="text-red-400 text-xs text-center px-4 mt-2">{locationError}</p>}
    </div>
  );
};
