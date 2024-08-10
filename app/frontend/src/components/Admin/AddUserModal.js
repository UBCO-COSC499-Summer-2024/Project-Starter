import React, { useState } from 'react';
import addUser from '../../hooks/AddUser';

const AddUserModal = ({ onClose, fetchData }) => {
  const [studentNum, setStudentNum] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addUser(studentNum, firstName, lastName, email, role);
    fetchData();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-gray-700 text-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Add User</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block">Student Number</label>
                <input
                  type="number"
                  value={studentNum}
                  onChange={(e) => setStudentNum(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-600"
                  required
                />
          </div>
          <div className="mb-4">
            <label className="block">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-600"
              required
            >
              <option value="1">Student</option>
              <option value="2">Instructor</option>
              <option value="3">Admin</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-500 text-white rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
