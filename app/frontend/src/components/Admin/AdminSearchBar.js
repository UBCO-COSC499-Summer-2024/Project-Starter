import React from 'react';
import { useTheme } from '../../App'; 

const SearchBar = ({ onSearch }) => {
  const { theme } = useTheme();

  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="w-full max-w-md mt-2 sm:mt-0 relative">
      <input
        type="text"
        placeholder="Search"
        onChange={handleInputChange}
        className={`w-full p-3 pl-10 pr-4 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600' : 'bg-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-300'}`}
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-4.35-4.35m1.85-5.15A7.5 7.5 0 1110.5 3a7.5 7.5 0 017.5 7.5z"
        ></path>
      </svg>
    </div>
  );
};

export default SearchBar;