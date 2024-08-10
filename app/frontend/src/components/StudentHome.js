import React from 'react';

const StudentHome = () => {
  const recentTests = [
    { id: 1, course: "MATH 120-002", exam: "Final Exam", grade: "83.4%", median: "73%", mean: "72.3%", max: "98.7%", min: "43.6%" },
    { id: 2, course: "MATH 120-002", exam: "Final Exam", grade: "83.4%", median: "73%", mean: "72.3%", max: "98.7%", min: "43.6%" },
    { id: 3, course: "MATH 120-002", exam: "Final Exam", grade: "83.4%", median: "73%", mean: "72.3%", max: "98.7%", min: "43.6%" },
    { id: 4, course: "MATH 120-002", exam: "Final Exam", grade: "83.4%", median: "73%", mean: "72.3%", max: "98.7%", min: "43.6%" },
    { id: 5, course: "MATH 120-002", exam: "Final Exam", grade: "83.4%", median: "73%", mean: "72.3%", max: "98.7%", min: "43.6%" },
  ];

  const overallMarks = [
    { id: 1, course: "MATH 100-003", name: "Differential Calculus", grade: "84.3%", term: "Winter 2024" },
    { id: 2, course: "PHYS 101-001", name: "Calculus Based Physics", grade: "78.5%", term: "Winter 2024" },
    { id: 3, course: "CHEM 110-002", name: "Principles of Chemistry", grade: "82.6%", term: "Winter 2024" },
    { id: 4, course: "STAT 230-001", name: "Introduction to Biostatistics", grade: "91.4%", term: "Winter 2024" },
    { id: 5, course: "ENGL 153-001", name: "Narrative Writing", grade: "87.0%", term: "Winter 2024" },
    { id: 6, course: "MATH 100-002", name: "Differential Calculus", grade: "43.3%", term: "Fall 2023" },
  ];

  return (
    <div className="student-home p-8 bg-primary text-white h-screen">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl">John Doe</h2>
          <p>Student ID: 123456789</p>
        </div>
        <h1 className="text-3xl font-bold">DASHBOARD</h1>
        <button className="bg-secondary px-4 py-2 rounded">Logout</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Test Results</h2>
          {recentTests.map(test => (
            <div key={test.id} className="bg-secondary p-4 mb-4 rounded shadow">
              <p className="text-sm">{test.course} <span className="text-gray-400">{test.exam}</span></p>
              <p className="text-2xl font-bold">{test.grade}</p>
              <div className="text-gray-400 text-sm mt-2">
                <p>Median: {test.median}</p>
                <p>Mean: {test.mean}</p>
                <p>Max: {test.max}</p>
                <p>Min: {test.min}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Overall Course Marks</h2>
          {overallMarks.map(mark => (
            <div key={mark.id} className="bg-secondary p-4 mb-4 rounded shadow">
              <p className="text-sm font-bold">{mark.course} <span className="text-gray-400">{mark.name}</span></p>
              <p className="text-2xl font-bold">{mark.grade}</p>
              <p className="text-gray-400 text-sm">{mark.term}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
