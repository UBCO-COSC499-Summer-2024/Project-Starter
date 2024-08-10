const getCourseData = async (user_id) => {
  try {
    const response = await fetch(`http://localhost/api/courses/${user_id}`);
    if(response.ok) {
      const courses = await response.json();
      //console.log(courses);
      return courses;
    }
    else {
      console.error('POST Error',response.status, response.statusText);
      return;
    }
  } catch(error) {
    console.error('Failure fetching data: ',error);
    return;
  };
};

export default getCourseData;