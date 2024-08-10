import React from 'react';
import { Link } from 'react-router-dom';

const instructorCourses = [
  { id: 1, name: "MATH 100-001", description: "Differential Calculus", term: "Winter 2024" },
  { id: 2, name: "MATH 100-002", description: "Differential Calculus", term: "Winter 2024" },
  { id: 3, name: "MATH 200-001", description: "Proof Techniques", term: "Winter 2024" },
];

const InstructorCourseList = () => {
  return (
    <div className="h-full w-64 bg-gray-800 text-white flex flex-col fixed overflow-scroll">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Courses</h2>
        <ul className="space-y-2">
          {instructorCourses.map(course => (
            <li key={course.id}>
              <div className="p-2 rounded-lg bg-gray-800 cursor-pointer">
                <Link to={`/instructor/course/${course.id}`}>
                  <div className="text-white font-bold">{course.name}</div>
                  <div className="text-sm text-gray-400">{course.description}</div>
                  <div className="text-sm text-gray-500">{course.term}</div>
                </Link>
              </div>
            </li>
          ))}
          <li className="p-2 bg-gray-700 rounded-lg text-center text-green-500 cursor-pointer">
            <div>+</div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InstructorCourseList;