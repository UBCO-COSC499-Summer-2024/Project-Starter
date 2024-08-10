import React, { useState } from 'react';
import MenuBar from './MenuBar'; // Adjust the path as needed
import SearchBar from './SearchBar'; // Adjust the path as needed
import StudentList from './StudentList'; // Adjust the path as needed
import studentListDetails from './studentListDetails'; // Adjust the path as needed

const mockCourses = [
  {
    id: 1,
    name: 'MATH 100-001',
    description: 'Differential Calculus',
    term: 'Winter 2024',
    quizzes: [
      { id: 1, name: 'Quiz 1', score: '86.2%' },
      { id: 2, name: 'Quiz 2', score: '86.2%' },
      { id: 3, name: 'Midterm 1', score: '86.2%' },
      { id: 4, name: 'Quiz 3', score: '86.2%' },
      { id: 5, name: 'Quiz 4', score: '86.2%' }
    ]
  },
  {
    id: 2,
    name: 'MATH 100-002',
    description: 'Differential Calculus',
    term: 'Winter 2024',
    quizzes: []
  },
  {
    id: 3,
    name: 'MATH 200-001',
    description: 'Proof Techniques',
    term: 'Winter 2024',
    quizzes: []
  }
];

const InstructorDashboard = () => {
  const [courses] = useState(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState(mockCourses[0]);
  const [quizzes, setQuizzes] = useState(mockCourses[0].quizzes);
  const [selectedMenu, setSelectedMenu] = useState('tests');

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setQuizzes(course.quizzes);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Logo" className="h-8 mr-2" />
          <h1 className="text-2xl font-bold">GradeIT OMR Technologies</h1>
        </div>
        <div>
          <p className="text-sm">John Doe</p>
          <p className="text-sm">Instructor ID: 123456789</p>
        </div>
        <button className="bg-gray-700 px-4 py-2 rounded">Logout</button>
      </header>
      <MenuBar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <SearchBar />
      <div className="flex">
        <aside className="w-1/4 bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-bold mb-4">Courses</h2>
          <ul>
            <li className="mb-2 p-2 bg-gray-700 rounded">
              <div>Dashboard</div>
            </li>
            {courses.map(course => (
              <li
                key={course.id}
                className={`mb-2 p-2 bg-gray-700 rounded ${selectedCourse.id === course.id ? 'border-l-4 border-blue-500' : ''}`}
                onClick={() => handleCourseClick(course)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    {course.name}<br />
                    <span className="text-sm text-gray-400">{course.description}<br />{course.term}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-500 p-2 rounded">⤴</button>
                    <button className="bg-orange-500 p-2 rounded">✎</button>
                    <button className="bg-red-500 p-2 rounded">✗</button>
                  </div>
                </div>
              </li>
            ))}
            <li className="p-2 bg-gray-700 rounded text-center text-green-500">+</li>
          </ul>
        </aside>
        <main className="flex-1 p-4">
          {selectedMenu === 'tests' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">{selectedCourse.name} Tests</h2>
              </div>
              <div className="mt-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="p-4 mb-4 rounded-lg bg-gray-700 text-white flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">{quiz.name}</h3>
                      <p className="text-lg">Mean: {quiz.score}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-blue-500 p-2 rounded">⤴</button>
                      <button className="bg-orange-500 p-2 rounded">✎</button>
                      <button className="bg-red-500 p-2 rounded">✗</button>
                    </div>
                  </div>
                ))}
                <div className="p-4 mb-4 rounded-lg bg-gray-700 text-center text-white cursor-pointer">
                  <span className="text-xl">+</span>
                </div>
              </div>
            </>
          )}
          {selectedMenu === 'students' && <StudentList />}
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard;
