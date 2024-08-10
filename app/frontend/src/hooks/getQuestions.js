const getQuestions = async (exam_id, user_id) => {
  try {
      const response = await fetch(`http://localhost/api/questions/responses/${exam_id}&${user_id}`);
      if (response.ok) {
          const questions = await response.json();
          console.log(`Total questions fetched: ${questions.length}`); // Add this line for debugging
          return questions;
      } else {
          console.error('Error fetching questions:', response.status, response.statusText);
          return [];
      }
  } catch (error) {
      console.error('Failure fetching data:', error);
      return [];
  }
};

export default getQuestions;
