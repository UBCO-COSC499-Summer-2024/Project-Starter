const { db } = require('../database');

const addQuestion = async (exam_id, num_options, correct_answer, weight, question_num) => {
    try {
        await db.none(
            `INSERT INTO questions (exam_id, num_options, correct_answer, weight, question_num)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (exam_id, question_num)
             DO UPDATE SET
                num_options = EXCLUDED.num_options,
                correct_answer = EXCLUDED.correct_answer,
                weight = EXCLUDED.weight`, 
            [exam_id, num_options, correct_answer, weight, question_num]
        );
    } catch (error) {
        console.error(`Error adding or updating question: ${error.message}`);
    }
};

const editAnswer = async (questionId, correctAnswer) => {
    try {
        await db.none('UPDATE questions SET correct_answer = $1 WHERE id = $2', [correctAnswer, questionId]);
    } catch(error) {
        console.error('Error updating answer for quesiton',questionId);
        throw error;
    }
};

const editWeight = async (questionId, weight) => {
    try {
        await db.none('UPDATE questions SET weight = $1 WHERE id = $2', [weight, questionId]);
    } catch(error) {
        console.error('Error updating weight for quesiton',questionId);
        throw error;
    }
}

const getQuestionData = async (userId, examId) => {
    try {
        const response = await db.manyOrNone(
            `SELECT 
                r.question_id, 
                r.user_id, 
                r.response, 
                r.grade, 
                q.num_options, 
                q.correct_answer, 
                q.question_num, 
                q.weight, 
                c.department,
                c.code,
                c.section, 
                e.name AS exam_name, 
                r.was_modified, 
                f.issue 
            FROM 
                responses r 
            LEFT JOIN 
                flags f ON f.question_id = r.question_id AND f.user_id = r.user_id
            LEFT JOIN 
                questions q ON r.question_id = q.id 
            LEFT JOIN 
                exams e ON q.exam_id = e.id 
            LEFT JOIN 
                courses c ON e.course_id = c.id 
            WHERE 
                e.id = $1 
                AND r.user_id = $2 
            ORDER BY 
                q.question_num;
            `, [examId, userId]
        );
        return response;
    } catch(error) {
        console.log('Error getting responses for exam',examId,'and user',userId);
    }
}

const getExamAnswers = async (examId) => {
    try {
        const response = await db.manyOrNone(
            'SELECT id AS question_id, correct_answer, weight, question_num, num_options FROM questions WHERE exam_id = $1 ORDER BY question_num', [examId]
        );
        return response;
    } catch(error) {
        console.log('Error getting questions for exam', examId, error);
    }
}

const deleteAnswer = async (questionId) => {
    try {
        await db.none('DELETE FROM questions WHERE id = $1', [questionId])
    } catch(error) {
        console.error('Error deleting answer for question',questionId);
        throw error;
    }
}

module.exports = {
    addQuestion,
    editAnswer,
    getQuestionData,
    getExamAnswers,
    deleteAnswer,
    editWeight
}

