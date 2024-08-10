const getGrades = async (courseId) => {
    const response = await fetch(
      `HTTP://localhost/API/courses/grades/${courseId}`
    );
    if (response.ok) {
      const grades = await response.json();
      return grades;
    } else {
      console.log("Error retrieving grades");
      return null;
    }
  };

  export default getGrades;
  