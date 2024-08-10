import React, { useState, useEffect } from 'react';

const UserManagementModal = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      // Replace with your actual API call to fetch users
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Manage Users</h2>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <p>{user.name} ({user.email})</p>
              <button>Edit</button>
              <button>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserManagementModal;

