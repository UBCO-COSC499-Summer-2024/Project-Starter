const getTestData = async (course_id) => {
    try {
      const response = await fetch(`http://localhost/api/tests/${course_id}`);
      if(response.ok) {
        const tests = await response.json();
        return tests;
      }
      else {
        console.error('GET Error',response.status, response.statusText);
        return;
      }
    } catch(error) {
      console.error('Failure fetching data: ',error);
      return;
    };
  };

  export default getTestData;