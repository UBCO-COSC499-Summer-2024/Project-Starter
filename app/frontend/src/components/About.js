import React from 'react';
import { useTheme } from '../App'; 

const About = () => {
  const { theme } = useTheme();

  return (
    <div className={`about p-8 shadow rounded w-3/5 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-4xl font-bold text-blue-900">About Us</h1>
      <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        GradeIT OMR Technologies is an innovative platform providing advanced OMR solutions for educational institutions...
      </p>
    </div>
  );
}

export default About;
