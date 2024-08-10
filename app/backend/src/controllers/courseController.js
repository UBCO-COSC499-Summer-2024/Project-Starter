const { db } = require('../database');
const { register } = require('./userController');

const addCourse = async (user_id, department, code, section, description, start_date, end_date) => {
  try {
      const dateRegex = /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])$/;
      if(dateRegex.test(end_date) && dateRegex.test(start_date)) {
          const response = await db.oneOrNone(
              'INSERT INTO courses (department, code, section, description, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [department, code, section, description, start_date, end_date]
          );
          await register(user_id, response.id);
          const newCourse = { user_id, department, code, section, description, end_date, course_id: response.id };
          return newCourse;
      } else {
          console.error('Invalid date. Please use yyyy-mm-dd');
          return null;
      };
  } catch(error) {
      console.error(`Error adding course ${department + " " + code + "-" + section}`,error);
  };
};

const editCourse = async (department, code, section, description, start_date, end_date, courseId) => {
  try {
    await db.none(
      'UPDATE courses SET department = $1, code = $2, section = $3, description = $4, start_date = $5, end_date = $6 WHERE id = $7', [department, code, section, description, start_date, end_date, courseId]
    );
  } catch(error) {
    console.error('Error updating course ',(department + " " + code + "-" + section));
  }
}

const getAllCourses = async (req, res) => {
  try {
    const courses = await db.any('SELECT * FROM courses');
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCoursesByUserId = async (id) => {
  try {
      const response = await db.manyOrNone(
          'SELECT course_id, department, code, section, description, start_date, end_date FROM users JOIN registration ON registration.user_id = users.id JOIN courses ON registration.course_id = courses.id WHERE users.id = $1 ORDER BY department', [id]
      );
      return response;
  } catch(error) {
      console.log(`Error getting course data for id ${id}`,error);
  };
};

const getCourseInfo = async (id) => {
  try {
      const response = await db.oneOrNone(
          'SELECT * FROM courses WHERE id = $1', [id]
      );
      return response;
  } catch(error) {
      console.error(`Error getting course data for course id ${id}`, error);
  }
}

const calculateGrades = async (courseId, examId = null) => {
  let examCondition = examId ? `AND exams.id = ${examId}` : ``;
  try {
      const grades = await db.manyOrNone(
         `WITH
              registeredStudents AS (
                SELECT user_id AS "userId", users.last_name AS "lastName", users.first_name AS "firstName"
                FROM users JOIN registration ON users.id = user_id
                WHERE course_id = ${courseId} AND users.role = 1
          ),

              studentsWithExams AS (
                SELECT users.id AS "userId", users.last_name AS "lastName", users.first_name AS "firstName",
                registration.user_Id IS NOT NULL AS "isRegistered",
                exams.id AS "examId",  exams.name AS "examName",
                  SUM(weight*(CASE WHEN response=correct_answer THEN 1 ELSE 0 END))
                  AS "studentScore", SUM(weight) AS "maxScore"
                FROM users
            JOIN responses ON users.id = responses.user_id
            JOIN questions ON questions.id = question_id
            JOIN exams ON exams.id = exam_id ${examCondition}
            LEFT JOIN registration ON 
              responses.user_id = registration.user_id
              AND registration.course_id = ${courseId}
                WHERE exams.course_id = ${courseId} AND users.role = 1
                GROUP BY  users.id, users.last_name, users.first_name,
                exams.id, exams.name, registration.user_Id
          ),

              StudentsWithoutExams AS (
                SELECT registeredStudents."userId", registeredStudents."lastName",
                  registeredStudents."firstName", 1=1 AS "isRegistered",
                  -1 AS "examId", NULL AS "examName", 0 AS "studentScore",  1 AS "maxScore"
                FROM studentsWithExams 
                RIGHT JOIN registeredStudents ON studentsWithExams."userId" = registeredStudents."userId"
                WHERE studentsWithExams."userId" IS NULL
          )
          SELECT * FROM StudentsWithoutExams
          UNION
          SELECT * FROM studentsWithExams
          ORDER BY "userId" ASC, "examId" ASC;`
      );
      if (grades.length > 0) {
          return grades;
      } else  {
        if(examId) {
          return("noExams")
        } else {
          //maybe should be using getStudentsByCourseId?
          const courseStudents = await db.manyOrNone(
             `SELECT user_id AS "userId", users.last_name AS "lastName", users.first_name AS "firstName"
              FROM users JOIN registration ON id = user_id
              WHERE course_id = ${courseId} AND role = 1;`
          );
          return courseStudents;
        }
      }
  } catch(error) {
      console.error(`Error calculating grades`);
  };
};

const examsByYear = async(department, code, name) => {
  try {
    const exams = await db.manyOrNone( 
       `SELECT exams.id AS "examId", course_id AS "courseId", start_date AS "startDate", section
        FROM exams JOIN courses ON course_id = courses.id
        WHERE department = '${department}' AND code ='${code}' AND exams.name = '${name}'
        `
      );
      if(exams.length > 0) {
        let examGradeLists = [];
        for(let i = 0; i < exams.length; i++) {
          examGradeLists.push({
            gradeList: await calculateGrades(exams[i].courseId, exams[i].examId),
            courseId: exams[i].courseId,
            section: exams[i].section,
            startDate: exams[i].startDate
          });
        }
        return examGradeLists;
      } else {
        console.error(`Error calculating grades`);
      }
    } catch {
      console.error(`Error calculating grades`);
    }
}

const getTotalCourses = async (req, res) => {
  try {
    const totalCourses = await db.one('SELECT COUNT(*) AS total_courses FROM courses');
    return totalCourses;
  } catch (error) {
    console.error('Error fetching total courses:', error);
    return null;
  }
};

const getActiveCourses = async (req, res) => {
  try {
    const activeCourses = await db.one('SELECT COUNT(*) AS active_courses FROM courses WHERE end_date >= CURRENT_DATE');
    console.log(activeCourses)
    return activeCourses;
  } catch (error) {
    console.error('Error fetching active courses:', error);
    return null;
  }
};

const getAverageStudentsPerCourse = async (req, res) => {
  try {
    const avgStudents = await db.one(`SELECT AVG(student_count) AS avgStudents
FROM (
  SELECT COUNT(user_id) AS student_count
  FROM registration
  GROUP BY course_id
) AS course_student_counts `);
      console.log(avgStudents)
    return avgStudents;
  } catch (error) {
    console.error('Error fetching average students per course:', error);
    return null;
  }
};


module.exports = {
  getAllCourses,
  addCourse,
  getCoursesByUserId,
  getCourseInfo,
  calculateGrades,
  editCourse,
  examsByYear,
  getTotalCourses,
  getActiveCourses,
  getAverageStudentsPerCourse
 
};
