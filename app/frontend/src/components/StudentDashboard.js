import React, { useEffect } from 'react';

const tests = [
  { id: 1, name: 'Final Exam', grade: '86.2%', stats: { median: '82%', mean: '81.4%', max: '100%', min: '54%' } },
  { id: 2, name: 'Midterm 2', grade: '77.2%', stats: { median: '71%', mean: '70.3%', max: '94%', min: '45%' } },
  { id: 3, name: 'Mid-Midterm 2', grade: '86.2%', stats: { median: '82%', mean: '81.4%', max: '100%', min: '54%' } },
  { id: 4, name: 'Midterm 1', grade: '86.2%', stats: { median: '82%', mean: '81.4%', max: '100%', min: '54%' } },
  { id: 5, name: 'Mid-Midterm 1', grade: '86.2%', stats: { median: '82%', mean: '81.4%', max: '100%', min: '54%' } },
  { id: 6, name: 'Evaluation Quiz', grade: '15%', stats: { median: '100%', mean: '98.3%', max: '100%', min: '15%' } },
];

const StudentDashboard = () => {

    

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img src="/gradeit.svg" alt="Logo" className="h-8 mr-2" />
          <h1 className="text-2xl font-bold">GradeIT OMR Technologies</h1>
        </div>
        <div>
          <p className="text-sm">John Doe</p>
          <p className="text-sm">Student ID: 123456789</p>
        </div>
        <button className="bg-gray-700 px-4 py-2 rounded">Logout</button>
      </header>
      <div className="flex">
        <aside className="w-1/4 bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-bold mb-4">Courses</h2>
          <ul>
            <li className="mb-2 p-2 bg-gray-700 rounded">MATH 100-003<br /><span className="text-sm text-gray-400">Differential Calculus<br />Winter 2024</span></li>
            <li className="mb-2 p-2 bg-gray-700 rounded">PHYS 101-001<br /><span className="text-sm text-gray-400">Calculus Based Physics<br />Winter 2024</span></li>
            <li className="mb-2 p-2 bg-gray-700 rounded">CHEM 110-002<br /><span className="text-sm text-gray-400">Principles of Chemistry<br />Winter 2024</span></li>
            <li className="mb-2 p-2 bg-gray-700 rounded">STAT 230-001<br /><span className="text-sm text-gray-400">Introduction to Biostatistics<br />Winter 2024</span></li>
            <li className="mb-2 p-2 bg-gray-700 rounded">ENGL 153-002<br /><span className="text-sm text-gray-400">Narrative Writing<br />Winter 2024</span></li>
            <li className="p-2 bg-gray-700 rounded text-center text-green-500">+</li>
          </ul>
        </aside>
        <main className="flex-1 p-4">
          <h2 className="text-lg font-bold mb-4">Your Average Grade in MATH 100-003: 72.83%</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Test</th>
                <th className="p-2">Grade</th>
                <th className="p-2">Stats</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id} className="bg-gray-800 mb-2 p-2 rounded">
                  <td className="p-2">{test.name}</td>
                  <td className="p-2">{test.grade}</td>
                  <td className="p-2">
                    Median: {test.stats.median}<br />
                    Mean: {test.stats.mean}<br />
                    Max: {test.stats.max}<br />
                    Min: {test.stats.min}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
