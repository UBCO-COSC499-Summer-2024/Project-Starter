const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const {
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
} = require('../controllers/courseController');

// URL Begins With: localhost/api/courses

router.get('/', courseController.getAllCourses);
router.post('/', courseController.addCourse);

router.get('/:id', async (req, res) => {
    try {
        const courses = await getCoursesByUserId(req.params.id);
        res.status(200).json(courses);
    } catch(error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/add', async (req, res) => {
    const { department, code, section, description, start_date, end_date, user_id } = req.body;
    if(department && code && section && description && start_date && end_date && user_id) {
        try {
            const newCourse = await addCourse(user_id, department, code, section, description, start_date, end_date);
            res.status(200).json(newCourse);
        } catch(error) {
            res.status(500).json({error: error.message});
        }
    } else {
        res.status(400).json({error: "Missing info for adding a course"});
    }
});

router.post('/edit', async (req, res) => {
    const { department, code, section, description, start_date, end_date, course_id } = req.body;
    if(department && code && section && description && start_date && end_date && course_id) {
        try {
            const response = await editCourse(department, code, section, description, start_date, end_date, course_id);
            res.status(200).json(response);
        } catch(error) {
            res.status(500).json({error: error.message});
        }
    } else {
        res.status(400).json({error: "Missing info for editing a course"});
    }
})

router.get('/info/:id', async (req, res) => {
    try {
        const data = await getCourseInfo(req.params.id);
        res.status(200).json(data);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/grades/:id', async (req, res) => {
    const id = req.params.id;
    if(id) {
        try {
            const grades = await calculateGrades([req.params.id]);
            res.status(200).json(grades);
        } catch(error) {
            res.status(400).json({error: error.message});
        }
    } else {
        res.status(400).json({error: "id is not sent"});
    }
});

router.get('/yearByYearGrades/:department/:code/:name', async (req, res) => {
    const department = req.params.department;
    const code = req.params.code;
    const name = req.params.name;
    if(department && code && name) {
        try {
            const exams = await examsByYear(department, code, name);
            console.log(exams);
            res.status(200).json(exams)
        } catch {
            res.status(400).json({error: "Error retrieving year by year exams"});
        }
    }
});

router.get('/metrics/total-courses', async (req, res) => {
    try {
      const totalCourses = await getTotalCourses();
      res.status(200).json({ totalCourses });
    } catch (error) {
      res.status(500).json({ message: 'Error getting total courses', error });
    }
  });
  
  router.get('/metrics/active-courses', async (req, res) => {
    try {
      const activeCourses = await getActiveCourses();
      res.status(200).json({ activeCourses });
    } catch (error) {
      res.status(500).json({ message: 'Error getting active courses', error });
    }
  });
  
  router.get('/metrics/average-students-per-course', async (req, res) => {
    try {
      const averageStudents = await getAverageStudentsPerCourse();
      res.status(200).json({ averageStudents });
    } catch (error) {
      res.status(500).json({ message: 'Error getting average students per course', error });
    }
  });
  

module.exports = router;
