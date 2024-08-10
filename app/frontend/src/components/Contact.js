import React from 'react';
import { useTheme } from '../App'; 

const Contact = () => {
  const { theme } = useTheme();

  return (
    <div className={`contact p-8 shadow rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-4xl font-bold text-blue-900">Contact Us</h1>
      <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Email: support@gradeitomr.com</p>
    </div>
  );
}

export default Contact;
