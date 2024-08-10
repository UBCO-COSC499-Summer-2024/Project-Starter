import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../App'; // Importing the useTheme hook
import Toast from './Toast'; // Importing the Toast component

const ForgotPassword = () => {
  const { theme } = useTheme(); // Using the useTheme hook
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setToast({ show: true, message: data.message, type: 'success' });
      } else {
        setToast({ show: true, message: 'Error sending password reset email', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: 'Internal Server Error', type: 'error' });
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <div className="h-full flex items-center justify-center">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
      <div
        className={`flex flex-col items-center justify-center w-11/12 max-w-md ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        } p-8 rounded-lg shadow-lg`}
      >
        <h2
          className={`${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          } text-xl font-semibold mb-4`}
        >
          Password Recovery
        </h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label
              className={`${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
              } font-semibold`}
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className={`w-full px-3 py-2 rounded-md mt-1 ${
                theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'
              } shadow-inner`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-md ${
              theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-black hover:bg-gray-400'
            } font-semibold`}
          >
            Submit
          </button>
        </form>
        <button
          onClick={handleCancel}
          className={`w-full py-2 rounded-md mt-4 ${
            theme === 'dark'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-300 text-black hover:bg-gray-400'
          } font-semibold`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
