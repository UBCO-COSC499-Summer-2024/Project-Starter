const getStudentData = async (course_id) => {
    try {
      const response = await fetch(`http://localhost/api/users/${course_id}`);
      if(response.ok) {
        const students = await response.json();
        return students;
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

  export default getStudentData;