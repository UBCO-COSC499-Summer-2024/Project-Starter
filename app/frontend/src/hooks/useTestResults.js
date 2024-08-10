import { useState, useEffect } from 'react';
import axios from 'axios';

const useTestResults = (testId) => {
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await axios.get(`/api/test-results/${testId}`);
        setTestResults(response.data);
      } catch (error) {
        console.error('Error fetching test results:', error);
      }
    };

    fetchTestResults();
  }, [testId]);

  return testResults;
};

export default useTestResults;
