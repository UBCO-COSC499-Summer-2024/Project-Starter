import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../App'; // Importing the useTheme hook
import Toast from './Toast'; // Importing the Toast component

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const { theme } = useTheme(); // Using the useTheme hook
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setToast({ show: true, message: data.message, type: 'success' });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
            navigate('/login');
          }, 250); 
      } else {
        setToast({ show: true, message: 'Error resetting password', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: 'Internal Server Error', type: 'error' });
    }
  };

  return (
    <div className={`h-full flex items-center justify-center`}>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
      <div className={`flex flex-col items-center justify-center w-11/12 max-w-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-8 rounded-lg shadow-lg`}>
        <h2 className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-xl font-semibold mb-4`}>Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} font-semibold`} htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter new password"
              className={`w-full px-3 py-2 rounded-md mt-1 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'} shadow-inner`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={`w-full py-2 rounded-md ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-black hover:bg-gray-400'} font-semibold`}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;