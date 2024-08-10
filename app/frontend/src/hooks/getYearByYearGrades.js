const getYearByYearGrades = async (department, code, name) => {
    const response = await fetch(
      `HTTP://localhost/API/courses/yearByYearGrades/${department}/${code}/${name}`
    );
    if (response.ok) {
      const grades = await response.json();
      console.log(grades);
      return grades;
    } else {
      console.log("Error retrieving previous grades");
      return null;
    }
  };

  export default getYearByYearGrades;