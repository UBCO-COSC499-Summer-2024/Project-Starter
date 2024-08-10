const { db } = require('../database');

const addResponse = async (exam_id, question_num, user_id, response, modifying = false) => {
    try {
        questionId = await db.oneOrNone(
            'SELECT id FROM questions WHERE exam_id = $1 AND question_num = $2', [exam_id, question_num]
        );
        if(questionId.id) {
            await db.none(
                'INSERT INTO responses (question_id, user_id, response, question_num, was_modified) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (question_id, user_id) DO UPDATE SET response = excluded.response, was_modified = excluded.was_modified', [questionId.id, user_id, response, question_num, modifying] 
            )
        } else {

        }
    } catch(error) {
        console.error('Error adding response')
    }
}

const deleteResponses = async (userId, examId) => {
    try {
        await db.none(`DELETE 
        FROM responses 
        WHERE 
            question_id IN (
                SELECT
                    questions.id 
                FROM 
                    questions 
                WHERE
                    exam_id = ${examId}
            )
            AND user_id = ${userId};`);
    } catch(error) {
        console.error(`Error deleting responses for user: ${userId} on exam ${examId}`);
        throw error;
    }
}

module.exports = {
    addResponse,
    deleteResponses
}