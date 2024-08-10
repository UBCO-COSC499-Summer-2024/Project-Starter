import { useState, useEffect } from 'react';

const useActiveCourses = () => {
  const [activeCourses, setActiveCourses] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveCourses = async () => {
      try {
        const response = await fetch('http://localhost:80/api/courses/metrics/active-courses');
        const data = await response.json();
        setActiveCourses(data.activeCourses);
      } catch (error) {
        setError(error);
      }
    };

    fetchActiveCourses();
  }, []);

  return { activeCourses, error };
};

export default useActiveCourses;

  