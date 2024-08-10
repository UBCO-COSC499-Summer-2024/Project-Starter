const { db } = require('../database');

const flagResponse = async (examId, userId, questionNum, flagText) => {
    console.log(examId, userId, questionNum, flagText)
    try {
        questionId = await db.oneOrNone(
            'SELECT id FROM questions WHERE exam_id = $1 AND question_num = $2', [examId, questionNum]
        );
        if(questionId.id) {
            await db.none(
                'INSERT INTO flags (exam_id, question_id, user_id, issue) VALUES ($1, $2, $3, $4)', [examId, questionId.id, userId, flagText]
            );
        }
    } catch(error) {
        console.error('Error adding response');
    }
}

const flagExam = async (examId, flagText) => {
    try {
        await db.none(
            'INSERT INTO flags (exam_id, issue) VALUES ($1, $2)', [examId, flagText]
        );
    } catch(error) {
        console.error('Error flagging exam',examId)
    }
}

const resolveFlag = async (flagId) => {
    try {
        const response = await db.oneOrNone(
            'DELETE FROM flags WHERE id = $1 RETURNING id', [flagId]
        );

        if (!response) {
            throw new Error('No flag found with the provided ID');
        }

        return response;
    } catch (error) {
        console.error('Error resolving flag:', error.message);
        throw new Error('Failed to resolve flag: ' + error.message);
    }
}

const getFlagged = async (userId) => {
    try {
        const response = await db.manyOrNone(
            `SELECT 
                flags.id, 
                flags.exam_id, 
                flags.user_id, 
                flags.issue, 
                exams.name AS exam_name, 
                courses.department AS course_dept,
                courses.code AS course_code,
                courses.section AS course_section, 
                questions.question_num 
            FROM 
                flags
            LEFT JOIN 
                questions ON flags.question_id = questions.id
            LEFT JOIN 
                exams ON flags.exam_id = exams.id
            LEFT JOIN 
                courses ON exams.course_id = courses.id
            LEFT JOIN 
                registration ON courses.id = registration.course_id
            LEFT JOIN 
                users ON registration.user_id = users.id
            WHERE 
                flags.issue IS NOT NULL AND 
                (users.id = $1 OR users.id IS NULL) AND 
                users.role = 2`, [userId]
        );
        return response;
    } catch(error) {
        console.error('Error getting flagged responses for instructor', userId);
    }
}

module.exports = {
    flagResponse,
    flagExam,
    resolveFlag,
    getFlagged,

}