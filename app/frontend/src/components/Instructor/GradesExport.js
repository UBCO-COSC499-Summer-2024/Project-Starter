import React from 'react';
import { useTheme } from '../../App';
import Papa from 'papaparse';

const GradesExport = ({ testId }) => {
    const { theme } = useTheme();

    const handleGradeExport = async () => {
        try {
            const response = await fetch(`http://localhost/api/tests/grades/${testId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const grades = await response.json();
            console.log(grades);

            // Convert JSON to CSV
            const csv = Papa.unparse(grades);

            // Create a blob from the CSV data
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

            // Create a link element, set the download attribute and click it to trigger download
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `grades_${grades[0].name}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return grades;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    return (
        <button 
            onClick={handleGradeExport} 
            className={`px-4 py-2 rounded transition duration-200 ml-4 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-yellow-600' : 'bg-gray-300 text-black hover:bg-yellow-400'}`}
        >
            Export Grades
        </button>
    );
};

export default GradesExport;
