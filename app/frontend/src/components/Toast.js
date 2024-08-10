import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const Toast = ({ message, type, onClose, onConfirm, showConfirm }) => {
  useEffect(() => {
    if (!showConfirm) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [onClose, showConfirm]);

  const getTypeStyles = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-500 text-white';
      case 'success':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50`}>
      <div className={`p-4 rounded ${getTypeStyles(type)} shadow-lg`}>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
          <span>{message}</span>
          {showConfirm ? (
            <>
              <button onClick={onConfirm} className="ml-4 bg-red-600 text-white px-2 py-1 rounded">
                Confirm Delete
              </button>
              <button onClick={onClose} className="ml-4 text-white font-bold">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={onClose} className="ml-4 text-white font-bold">
              &times;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toast;
