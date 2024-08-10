import React, { useState } from 'react';
import { useTheme } from '../../App';
import TestCorrectAnswers from './TestCorrectAnswers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import GenerateSheetModal from './GenerateSheetModal';
import { useNavigate } from 'react-router-dom';
import GradesExport from './GradesExport';
import getYearByYearGrades from "../../hooks/getYearByYearGrades";
import YearByYearStats from "./YearByYearStats";

const TestDescription = ({ test, onBack, onDeleteTest, asPercents, setAsPercents }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [visibility, setVisibility] = useState(test.visibility)

  const changeVisibility = async () => {
    const response = await fetch(`http://localhost/api/tests/set/visibility/${test.id}/${!test.visibility}`);
    if(response.ok) {
      setVisibility(value => !value);
    }
  }

  const [yearByYearInfo, setYearByYearInfo] = useState({
    showYearByYear: false,
    yearByYearGrades: [],
    deparment: test.department,
    code: test.code,
    testName: test.name,
  });

  const handleDeleteTest = () => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      onDeleteTest(test.id);
    }
  };

  const handleViewHistory = async () => {
    let yearByYearGrades = await getYearByYearGrades(
      test.department,
      test.code,
      test.name
    );
    console.log(yearByYearGrades);
    setYearByYearInfo({
      show: true,
      yearByYearGrades: yearByYearGrades,
      department: test.department,
      code: test.code,
      name: test.name,
    });
  };

  const handleYearByYearClose = () => {
    console.log("closing!!!");
    setYearByYearInfo({
      show: false,
      yearByYearGrades: [],
      department: test.department,
      code: test.code,
      name: test.name,
    });
  };

  const handleViewCorrectAnswers = () => {
    navigate(
      `/instructor/course/${test.courseId}/test/${test.id}/correct-answers`,
      { state: { test } }
    );
  };

  const handleGenerateSheet = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGenerateSheetType = (type) => {
    setShowModal(false);
    // Implement your logic for generating the sheet based on the type (100 or 200)
    console.log(`Generating a ${type} bubble sheet`);
  };

  if (!test) return null;

  return (
    <div
      className={`p-4 flex flex-col min-h-screen ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <button
        onClick={onBack}
        className={`px-4 py-2 rounded transition duration-200 mb-4 ${
          theme === "dark"
            ? "bg-gray-700 text-white hover:bg-blue-600"
            : "bg-gray-300 text-black hover:bg-blue-400"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 inline-block mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7 7-7M21 12H3"
          />
        </svg>
        Back
      </button>
      <div
        className={`rounded-lg p-6 shadow-lg ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">{test.name}</h2>
        {test.date_marked && <p className="mb-2"><strong>Date Marked:</strong> {test.date_marked.slice(0, 10)}</p>}
        {<p className="mb-2"><strong>Visibility:</strong> {visibility ? 'Viewable' : 'Hidden'} <span className='mx-2 px-2 py-1 bg-gray-700 rounded cursor-pointer hover:bg-purple-600 transition duration-200' onClick={changeVisibility} title="Click to change visbility"><FontAwesomeIcon icon={visibility ? faEyeSlash : faEye} /> Toggle Visibility</span></p>}
        {test.mean_score && <p className="mb-4"><strong>Mean Score:</strong> {test.mean_score}</p>}
        <button
          onClick={handleViewCorrectAnswers}
          className={`px-4 py-2 rounded transition duration-200 ${
            theme === "dark"
              ? "bg-gray-700 text-white hover:bg-blue-600"
              : "bg-gray-300 text-black hover:bg-blue-400"
          }`}
        >
          View / Edit Answer Key
        </button>
        <button
          onClick={handleViewHistory}
          className={`px-4 py-2 rounded transition duration-200 ml-4 mt-4 ${
            theme === "dark"
              ? "bg-gray-700 text-white hover:bg-blue-600"
              : "bg-gray-300 text-black hover:bg-blue-400"
          }`}
        >
          View Previous Statistics
        </button>
        <button
          onClick={handleGenerateSheet}
          className={`px-4 py-2 rounded transition duration-200 ml-4 mt-4 ${
            theme === "dark"
              ? "bg-gray-700 text-white hover:bg-green-600"
              : "bg-gray-300 text-black hover:bg-green-400"
          }`}
        >
          Generate a Sheet
        </button>
        <button
          onClick={handleDeleteTest}
          className={`px-4 py-2 rounded transition duration-200 ml-4 mt-4 ${
            theme === "dark"
              ? "bg-gray-700 text-white hover:bg-red-600"
              : "bg-gray-300 text-black hover:bg-red-400"
          }`}
        >
          Delete Test
        </button>
        <GradesExport testId={test.id}/>
      </div>
      <GenerateSheetModal
        showModal={showModal}
        onClose={handleCloseModal}
        onGenerateSheet={handleGenerateSheetType}
      />
      <YearByYearStats
        yearByYearInfo={yearByYearInfo}
        handleYearByYearClose={handleYearByYearClose}
        asPercents={asPercents}
        setAsPercents={setAsPercents}
      />
    </div>
  );
};

export default TestDescription;
