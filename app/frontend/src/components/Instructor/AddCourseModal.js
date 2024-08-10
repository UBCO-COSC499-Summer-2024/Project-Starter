import React, { useState } from 'react';
import { useTheme } from '../../App'; // Adjust the path as needed

const AddCourseModal = ({ isOpen, onClose, onAddCourse }) => {
  const [courseDept, setCourseDept] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseSection, setCourseSection] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const { theme } = useTheme();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const currentDate = new Date().toISOString().split('T')[0];
    if (startDate < currentDate) {
      alert('Start date cannot be before the current date.');
      return;
    }

    if (endDate < startDate) {
      alert('End date cannot be before the start date.');
      return;
    }

    if (endDate === startDate) {
      alert('Start date and end date cannot be the same.');
      return;
    }

    onAddCourse({
      courseDept,
      courseCode,
      courseSection,
      description,
      startDate,
      endDate,
    });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg p-6 w-96 shadow-lg relative ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-2xl font-bold mb-6">Add New Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="courseDept" className="block text-sm font-bold mb-2">Department</label>
            <select
              id="courseDept"
              name="courseDept"
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-300 focus:ring-blue-500' : 'bg-gray-200 text-black border-gray-400 focus:ring-blue-500'}`}
              value={courseDept}
              onChange={(e) => setCourseDept(e.target.value)}
              required
            >
              <option value="">--Please choose a department--</option>
              <option value="MATH">MATH</option>
              <option value="PHYS">PHYS</option>
              <option value="CHEM">CHEM</option>
              <option value="BIOL">BIOL</option>
              <option value="COMP">COMP</option>
              <option value="ECON">ECON</option>
              <option value="HIST">HIST</option>
              <option value="PSYC">PSYC</option>
              <option value="ENGL">ENGL</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="courseCode" className="block text-sm font-bold mb-2">Course Code</label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-300 focus:ring-blue-500' : 'bg-gray-200 text-black border-gray-400 focus:ring-blue-500'}`}
              value={courseCode}
              placeholder="ex. 100"
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="courseSection" className="block text-sm font-bold mb-2">Course Section</label>
            <input
              type="number"
              id="courseSection"
              name="courseSection"
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-300 focus:ring-blue-500' : 'bg-gray-200 text-black border-gray-400 focus:ring-blue-500'}`}
              value={courseSection}
              onChange={(e) => setCourseSection(e.target.value)}
              placeholder="0-999"
              max={999}
              min={0}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-bold mb-2">Course Description</label>
            <input
              type="text"
              id="description"
              name="description"
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-300 focus:ring-blue-500' : 'bg-gray-200 text-black border-gray-400 focus:ring-blue-500'}`}
              value={description}
              placeholder="ex. Introduction to Computer Science"
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-bold mb-2">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-300 focus:ring-blue-500' : 'bg-gray-200 text-black border-gray-400 focus:ring-blue-500'}`}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="endDate" className="block text-sm font-bold mb-2">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-300 focus:ring-blue-500' : 'bg-gray-200 text-black border-gray-400 focus:ring-blue-500'}`}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className={`px-4 py-2 rounded mr-2 transition duration-200 ${theme === 'dark' ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded transition duration-200 ${theme === 'dark' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-300 text-black hover:bg-blue-400'}`}
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;
