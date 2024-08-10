// app/frontend/tests/components/Instructor/StudentUpload.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StudentUpload from '../../../src/components/Instructor/StudentUpload';
import { useTheme } from '../../../src/App';

// Mock the useTheme hook
jest.mock('../../../src/App', () => ({
  useTheme: jest.fn(),
}));

describe('StudentUpload Component', () => {
  const mockOnFileUpload = jest.fn();

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
  });

  it('renders without crashing and displays the upload instructions', () => {
    render(<StudentUpload onFileUpload={mockOnFileUpload} />);

    // Check if the label and instructions are rendered
    expect(screen.getByText('Upload Student Data')).toBeInTheDocument();
    expect(screen.getByText('Please upload a CSV file containing student data. The file should have columns for Student ID, Last Name, First Name, and Role.')).toBeInTheDocument();
  });

  it('handles file upload correctly', () => {
    render(<StudentUpload onFileUpload={mockOnFileUpload} />);

    const file = new File(['student data'], 'students.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('Upload Student Data');

    fireEvent.change(input, { target: { files: [file] } });

    // Check if the onFileUpload function was called with the correct file
    expect(mockOnFileUpload).toHaveBeenCalledWith(file);
  });
});
