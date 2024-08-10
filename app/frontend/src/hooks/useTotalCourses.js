import { useState, useEffect } from 'react';

const useTotalCourses = () => {
  const [totalCourses, setTotalCourses] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalCourses = async () => {
      try {
        const response = await fetch('http://localhost:80/api/courses/metrics/total-courses');
        const data = await response.json();
        setTotalCourses(data.totalCourses);
      } catch (error) {
        setError(error);
      }
    };

    fetchTotalCourses();
  }, []);

  return { totalCourses, error };
};

export default useTotalCourses;
