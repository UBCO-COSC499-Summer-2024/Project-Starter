import React, { useState } from 'react';

const courses = [
  { id: 1, name: "Math 101", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 2, name: "Math 102", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 3, name: "Math 201", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 4, name: "Math 202", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 5, name: "Math 301", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 6, name: "Math 302", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 7, name: "Math 401", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 8, name: "Math 402", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
];

const CourseList = () => {
  const [activeCourse, setActiveCourse] = useState(null);

  const handleCourseClick = (courseId) => {
    setActiveCourse(activeCourse === courseId ? null : courseId);
  };

  return (
    <div className="course-list p-4">
      <h2 className="text-xl font-bold mb-4">Courses</h2>
      <ul className="space-y-2">
        {courses.map(course => (
          <li key={course.id}>
            <div onClick={() => handleCourseClick(course.id)} className="cursor-pointer text-blue-600 hover:underline">
              {course.name}
            </div>
            {activeCourse === course.id && (
              <ul className="pl-4 space-y-1 text-gray-700">
                {course.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
