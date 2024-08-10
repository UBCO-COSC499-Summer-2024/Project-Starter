import React, { useEffect, useState } from 'react';
import { useTheme } from '../../App';

const RecentChanges = () => {
  const [changes, setChanges] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    const storedChanges = JSON.parse(localStorage.getItem('changes')) || [];
    setChanges(storedChanges.reverse());
  }, []);

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Recent Changes</h1>
      <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
        <thead>
          <tr>
            <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Timestamp</th>
            <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>User ID</th>
            <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Name</th>
            <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Old Role</th>
            <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>New Role</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((change, index) => (
            <tr key={index} className={`rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
              <td className="p-4">{change.timestamp}</td>
              <td className="p-4">{change.userId}</td>
              <td className="p-4">{change.firstName} {change.lastName}</td>
              <td className="p-4">{change.oldRole === 1 ? "Student" : change.oldRole === 2 ? "Instructor" : change.oldRole === 3 ? "Admin" : ""}</td>
              <td className="p-4">{change.newRole === 1 ? "Student" : change.newRole === 2 ? "Instructor" : change.newRole === 3 ? "Admin" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentChanges;