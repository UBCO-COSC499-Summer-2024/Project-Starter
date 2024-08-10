import React, { useEffect, useState, useCallback } from 'react';
import getAllUsers from '../../hooks/GetAllUsers';
import changeUserRole from '../../hooks/changeUserRole';
import { useTheme } from '../../App';
import SearchBar from './AdminSearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddUserModal from './AddUserModal';
import getUserInfo from '../../hooks/getUserInfo';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[userId, setUserRole] = useState('');
  const { theme } = useTheme();

  const fetchData = useCallback(async () => {
    const data = await getAllUsers();
    const user = await getUserInfo();
    if(user){
      setUserRole(user.userId);
    }

    setUsers(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRoleChange = async (userId, newRole) => {
    const success = await changeUserRole(userId, newRole);
    if (success) {
      setUsers(users.map(user => (user.id === userId ? { ...user, role: newRole } : user)));
      logChange(userId, users.find(user => user.id === userId).role, newRole);
    } else {
      console.error('Failed to update role');
    }
  };

  const logChange = (userId, oldRole, newRole) => {
    const changes = JSON.parse(localStorage.getItem('changes')) || [];
    const user = users.find(user => user.id === userId);
    const changeLog = {
      userId,
      firstName: user.first_name,
      lastName: user.last_name,
      oldRole,
      newRole,
      timestamp: new Date().toLocaleString()
    };
    changes.push(changeLog);
    localStorage.setItem('changes', JSON.stringify(changes));
  };

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <SearchBar onSearch={setSearchQuery} />
        <button
          onClick={handleAddUser}
          className={`flex items-center pl-4 pr-2 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-black hover:bg-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
          <FontAwesomeIcon icon={faPlus} className='mr-3' />
          <span className="mr-2">Add User</span>
        </button>
      </div>
      <div className="flex-grow mt-4">
        <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
          <thead>
            <tr>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>User ID</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Last Name</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>First Name</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Email</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Role</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Change Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} className={`rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                <td className="p-4">{String(user.id).padStart(8, "0")}</td>
                <td className="p-4">{user.last_name}</td>
                <td className="p-4">{user.first_name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role === 1 ? "Student" : user.role === 2 ? "Instructor" : user.role === 3 ? "Admin" : ""}</td>
                <td className="p-4">
                 {userId !== user.id? (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, parseInt(e.target.value))}
                      className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}
                    >
                      <option value="1">Student</option>
                      <option value="2">Instructor</option>
                      <option value="3">Admin</option>
                    </select>
                  ) : (
                    <span>Cannot change own role</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <AddUserModal onClose={closeModal} fetchData={fetchData} />}
    </div>
  );
};

export default UserList;
