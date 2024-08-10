// app/frontend/src/components/ProfileMenuModal.js
import React, { useState, useMemo } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../App';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';

const ProfileMenuModal = ({ isOpen, onClose, user, onLogout, onAvatarSelect }) => {
  const { theme, toggleTheme } = useTheme();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatarOptions, setSelectedAvatarOptions] = useState({ seed: 'initial' });
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    setIsAvatarModalOpen(true);
  };

  const handleAvatarSelect = (options) => {
    setSelectedAvatarOptions(options);
    onAvatarSelect(options);
    setIsAvatarModalOpen(false);
  };

  const handleChangePassword = () => {
    onClose();
    navigate('/change-password');
  };

  // Generate a large number of avatar options dynamically
  const avatarOptionsList = useMemo(() => {
    return Array.from({ length: 50 }, (_, index) => ({ seed: `avatar${index + 1}` }));
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className={`rounded-lg p-4 w-80 relative ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
            >
              ×
            </button>
            <div className="flex items-center mb-4">
              <div className="cursor-pointer" onClick={handleAvatarClick}>
                <Avatar options={selectedAvatarOptions} size={64} />
              </div>
              <div>
                <p className="text-lg font-bold">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
            <button
              className={`block w-full py-2 px-4 mb-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'} text-left`}
              onClick={handleChangePassword}
            >
              Change Password
            </button>
            <div className="flex items-center justify-between py-2 px-4 mb-2 rounded-lg">
              <span className="font-bold">Change Theme</span>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faSun} className="mr-2" />
                <label className="relative inline-flex cursor-pointer items-center">
                  <input id="theme-switch" type="checkbox" className="sr-only peer" checked={theme === 'dark'} onChange={toggleTheme} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
                <FontAwesomeIcon icon={faMoon} className="ml-2" />
              </div>
            </div>
            <button
              onClick={onLogout}
              className={`block w-full py-2 px-4 mb-2 rounded-lg ${theme === 'dark' ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-300 text-black hover:bg-red-400'} text-left`}
            >
              Log out
            </button>
          </div>
        </div>
      )}
      <Modal
        isOpen={isAvatarModalOpen}
        onRequestClose={() => setIsAvatarModalOpen(false)}
        contentLabel="Select Avatar"
        className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} max-h-[80vh] overflow-y-auto`}
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
      >
        <h2 className="text-lg font-bold mb-4">Select Avatar</h2>
        <div className="grid grid-cols-3 gap-4">
          {avatarOptionsList.map((options, index) => (
            <div key={index} className="cursor-pointer" onClick={() => handleAvatarSelect(options)}>
              <Avatar options={options} size={128} /> {/* Set larger size for selection */}
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsAvatarModalOpen(false)}
          className={`mt-4 px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
        >
          Close
        </button>
      </Modal>
    </>
  );
};

export default ProfileMenuModal;
