import React from 'react';
import { useTheme } from '../../App';
import { useNavigate } from 'react-router-dom';

const GenerateSheetModal = ({ showModal, onClose }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  if (!showModal) return null;

  const handleGenerateSheet = (type) => {
    navigate(`/instructor/omr-sheet-generator/${type}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className={`rounded-lg p-6 z-50 shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-xl font-bold mb-4">Select Sheet Type</h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleGenerateSheet(100)}
            className={`px-4 py-2 rounded transition duration-200 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-green-600' : 'bg-gray-300 text-black hover:bg-green-400'}`}
          >
            100 Bubble Sheet
          </button>
          <button
            onClick={() => handleGenerateSheet(200)}
            className={`px-4 py-2 rounded transition duration-200 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-green-600' : 'bg-gray-300 text-black hover:bg-green-400'}`}
          >
            200 Bubble Sheet
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded transition duration-200 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-red-600' : 'bg-gray-300 text-black hover:bg-red-400'}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateSheetModal;
