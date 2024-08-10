import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import getTestData from '../hooks/getTestData';
import { useTheme } from '../App'; // Assuming useTheme is available at this path
import getGrades from '../hooks/getGrades';
import ParseStudentGrades from './Instructor/ParseStudentGrades';
import StudentTest from './Modules/CourseModule';

const CourseDetails = () => {
  const { courseId } = useParams();
  const [tests, setTests] = useState([]);
  const [courseName, setCourseName] = useState('Loading');
  const [gradeList, setGradeList] = useState('');
  const { theme } = useTheme();

  const fetchData = useCallback(async () => {
    const testData = await getTestData(courseId);
    console.log(testData);
    setTests(testData);
    setGradeList(await getGrades(courseId))
    console.log(testData)
    if (testData.length > 0) {
      setCourseName(testData[0].department + " " + testData[0].code + "-" + String(testData[0].section).padStart(3, '0'));
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [courseId, fetchData]);

  const parsedGrades = gradeList ? ParseStudentGrades(gradeList) : null;

  return (
    <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`} data-testid="course-details-container">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">{courseName} Tests</h2>
      </div>
      <div className="flex-grow">
        <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
          <thead>
            <tr>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Test</th>
              <th className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Your score</th>
              <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Mean</th>
              <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Stdev</th>
              <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Min</th>
              <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Q1</th>
              <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Median</th>
              <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Q3</th>
              <th className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>Max</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, index) => (
              test.visibility && parsedGrades &&
              <StudentTest parsedGrades={parsedGrades} test={test} key={index} asPercents={true} studentId = {2} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseDetails;
