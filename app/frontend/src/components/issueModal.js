// app/frontend/src/components/issueModal.js

import React from 'react';
import { useTheme } from '../App'; // Correct the import path

const Modal = ({ show, handleClose, handleSubmit, issue, setIssue }) => {
    const { theme } = useTheme();

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className={`p-6 rounded-lg shadow-lg w-96 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-2xl">Flag Question</h2>
                <p className="mb-2">(Your instructor will see this message)</p>
                <form onSubmit={handleSubmit}>
                    <textarea
                        className={`w-full p-2 border rounded mb-4 ${theme === 'dark' ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-100 text-black border-gray-300'}`}
                        rows="4"
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        maxLength={250}
                        placeholder="Enter the issue concisely (ex. I selected A but it says I selected B)"
                    />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className={`px-4 py-2 rounded mr-2 ${theme === 'dark' ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-300 text-black hover:bg-blue-400'}`}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;

