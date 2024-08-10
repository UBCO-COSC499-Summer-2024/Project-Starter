import React from 'react';
import { useTheme } from '../../App';

const StudentUpload = ({ onFileUpload }) => {
  const { theme } = useTheme();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="student-upload" className="block text-lg font-bold mb-2">
        Upload Student Data
      </label>
      <p className="mb-2 text-sm text-gray-500">
        Please upload a CSV file containing student data. The file should have columns for Student ID, Last Name, First Name, and Role.
      </p>
      <input
        id="student-upload"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className={`p-2 border rounded cursor-pointer ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-200 text-black border-gray-300'}`}
      />
    </div>
  );
};

export default StudentUpload;
