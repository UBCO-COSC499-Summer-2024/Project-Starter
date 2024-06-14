const { db } = require('../database');

const getCoursesByUserId = async (id) => {
    try {
        const response = await db.manyOrNone(
            'SELECT course_id, name, description, end_date FROM users JOIN registration ON registration.user_id = users.id JOIN courses ON registration.course_id = courses.id WHERE users.id = $1', [id]
        );
        return response;
    } catch(error) {
        console.log(`Error getting course data for id ${id}`,error);
    };
};

const getTestsByCourseId = async (id) => {
    try {
        const response = await db.manyOrNone(
            'SELECT exams.id, date_marked, exams.name, courses.name AS course_name FROM exams JOIN courses ON exams.course_id = courses.id WHERE course_id = $1', [id]
        );
        return response;
    } catch(error) {
        console.error(`Error getting course data for id ${id}`,error);
    };
};

const addStudent = async (first, last, email, password) => {
    try {
        await db.none(
            'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, 1)', [first, last, email, password]
        );
    } catch(error) {
        console.error(`Error adding student ${first}, ${last}`);
    };
};

const addCourse = async (name, description, end_date) => {
    try {
        const dateRegex = /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])$/;
        if(dateRegex.test(end_date)) {
        await db.none(
            'INSERT INTO courses (name, description, end_date) VALUES ($1, $2, $3)', [name, description, end_date]
        )} else {
            console.error('Invalid date. Please use yyyy-mm-dd');
        };
    } catch(error) {
        console.error(`Error adding course ${name}`);
    };
};

const addExam = async (course_id, name, date_marked, visibility) => {
    try {
        await db.none(
            'INSERT INTO exams (course_id, name, date_marked, visibility) VALUES ($1, $2, $3, $4)', [course_id, name, date_marked, visibility]
        );
    } catch(error) {
        console.error(`Error adding the exam ${name}`);
    };
};

const addQuestion = async (exam_id, num_options, correct_answer, weight) => {
    try {
        await db.none(
            'INSERT INTO questions (exam_id, num_options, correct_answer, weight) VALUES ($1, $2, $3, $4)', [exam_id, num_options, correct_answer, weight]
        );
    } catch(error) {
        console.error(`Error adding question`);
    };
};

module.exports = {
    getCoursesByUserId,
    getTestsByCourseId,
    addStudent,
    addCourse,
    addExam,
    addQuestion
    
}