import { useState, useEffect } from 'react';

const useAverageStudentsPerCourse = () => {
  const [averageStudents, setAvgStudents] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAverageStudents = async () => {
      try {
        const response = await fetch('http://localhost:80/api/courses/metrics/average-students-per-course');
        const data = await response.json();
        console.log(data)
        setAvgStudents(data.averageStudents);
      } catch (error) {
        setError(error);
      }
    };

    fetchAverageStudents();
  }, []);

  return { averageStudents, error };
};

export default useAverageStudentsPerCourse;
