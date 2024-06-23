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
            'SELECT exams.id, date_marked, exams.name, courses.name AS course_name FROM exams JOIN courses ON exams.course_id = courses.id WHERE course_id = $1 ORDER BY date_marked DESC', [id]
        );
        return response;
    } catch(error) {
        console.error(`Error getting course data for id ${id}`,error);
    };
};

const getRecentExamsByUserId = async (id) => {
    try {
        const response = await db.manyOrNone(
            'SELECT exams.id, date_marked, exams.name, courses.name AS course_name FROM users INNER JOIN registration ON users.id = registration.user_id INNER JOIN courses ON registration.course_id = courses.id INNER JOIN exams ON courses.id = exams.course_id WHERE users.id = $1 ORDER BY date_marked DESC', [id]
        );
        return response;
    } catch(error) {
        console.log(`Error getting recent courses for user id ${id}`,error);
    }
}

const getQuestionData = async (userId, examId) => {
    try {
        const response = await db.manyOrNone(
            'SELECT * FROM responses r JOIN questions q ON r.question_id = q.id JOIN exams e ON e.id = q.exam_id WHERE e.id = $1 AND r.user_id = $2', [examId, userId]
        );
        return response;
    } catch(error) {
        console.log('Error getting response for question',questionId,'and user',userId);
    }
}

const getStudentsByCourseId = async (courseId) => {
    try {
        const response = await db.manyOrNone(
            'SELECT u.id, u.first_name, u.last_name, u.role FROM users u JOIN registration r ON u.id = r.user_id JOIN courses c ON r.course_id = c.id WHERE c.id = $1 ORDER BY ROLE DESC', [courseId]
        );
        return response;
    } catch(error) {
        console.log('Error getting students for course:',courseId);
    }
}

const addStudent = async (first, last, email, password) => {
    try {
        await db.none(
            'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, 1)', [first, last, email, password]
        );
    } catch(error) {
        console.error(`Error adding student ${first}, ${last}`);
    };
};

const addCourse = async (user_id, name, description, end_date) => {
    try {
        const dateRegex = /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])$/;
        if(dateRegex.test(end_date)) {
            await db.none(
                'INSERT INTO courses (name, description, end_date) VALUES ($1, $2, $3)', [name, description, end_date]
            );
            const response = await db.oneOrNone(
                'SELECT id FROM courses WHERE name = $1 AND description = $2 AND end_date = $3', [name, description, end_date]
            )
            await register(user_id, response.id);
            const newCourse = { user_id, name, description, end_date, course_id: response.id };
            return newCourse;
        } else {
            console.error('Invalid date. Please use yyyy-mm-dd');
            return null;
        };
    } catch(error) {
        console.error(`Error adding course ${name}`);
    };
};

const register = async (userId, courseId) => {
    try {
        await db.none(
            'INSERT INTO registration (user_id, course_id) VALUES ($1, $2)', [userId, courseId]
        )
    } catch(error) {
        console.error('Error registering user with ID ',userId,"into course with ID",courseId)
    }
}

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
    getRecentExamsByUserId,
    getQuestionData,
    getStudentsByCourseId,
    addStudent,
    addCourse,
    addExam,
    addQuestion,
    register,
    
    
}