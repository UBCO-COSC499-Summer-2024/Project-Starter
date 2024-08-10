// app/frontend/tests/components/Instructor/InstructorCourseList.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import InstructorCourseList from '../../../src/components/Instructor/InstructorCourseList';

const instructorCourses = [
  { id: 1, name: "MATH 100-001", description: "Differential Calculus", term: "Winter 2024" },
  { id: 2, name: "MATH 100-002", description: "Differential Calculus", term: "Winter 2024" },
  { id: 3, name: "MATH 200-001", description: "Proof Techniques", term: "Winter 2024" },
];

describe('InstructorCourseList Component', () => {
  it('renders without crashing and displays courses', () => {
    render(
      <BrowserRouter>
        <InstructorCourseList />
      </BrowserRouter>
    );

    // Check if the heading is rendered
    expect(screen.getByText('Courses')).toBeInTheDocument();

    // Check if each course name is rendered
    instructorCourses.forEach(course => {
      expect(screen.getByText(course.name)).toBeInTheDocument();
    });

    // Check if each course description is rendered
    instructorCourses.forEach(course => {
      const courseDescriptions = screen.getAllByText(course.description);
      expect(courseDescriptions.length).toBeGreaterThanOrEqual(1);
    });

    // Check if each course term is rendered
    instructorCourses.forEach(course => {
      const courseTerms = screen.getAllByText(course.term);
      expect(courseTerms.length).toBeGreaterThanOrEqual(1);
    });

    // Check if the add course button is rendered
    expect(screen.getByText('+')).toBeInTheDocument();
  });
});
