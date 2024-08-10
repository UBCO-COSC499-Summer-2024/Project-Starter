const { db } = require('../database');
const {
    addQuestion,
    editAnswer,
    editWeight,
    getQuestionData,
    getExamAnswers,
    deleteAnswer
} = require('../controllers/questionController');

jest.mock('../database', () => ({
    db: {
        none: jest.fn(),
        manyOrNone: jest.fn()
    }
}));

describe('Question Controller', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    describe('addQuestion', () => {
        it('should add or update a question in the database', async () => {
            db.none.mockResolvedValue();

            await addQuestion(1, 4, [1, 2], 2, 1);

            expect(db.none).toHaveBeenCalledWith(
                `INSERT INTO questions (exam_id, num_options, correct_answer, weight, question_num)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (exam_id, question_num)
             DO UPDATE SET
                num_options = EXCLUDED.num_options,
                correct_answer = EXCLUDED.correct_answer,
                weight = EXCLUDED.weight`, 
                [1, 4, [1, 2], 2, 1]
            );
        });

        it('should log an error if the database query fails', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await addQuestion(1, 4, [1, 2], 2, 1);

            expect(console.error).toHaveBeenCalledWith('Error adding or updating question: DB Error');
        });
    });

    describe('editAnswer', () => {
        it('should update the correct answer for a question', async () => {
            db.none.mockResolvedValue();

            await editAnswer(1, [1, 2]);

            expect(db.none).toHaveBeenCalledWith(
                'UPDATE questions SET correct_answer = $1 WHERE id = $2',
                [[1, 2], 1]
            );
        });

        it('should log an error if the database query fails', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await expect(editAnswer(1, [1, 2])).rejects.toThrow('DB Error');

            expect(console.error).toHaveBeenCalledWith('Error updating answer for quesiton', 1);
        });
    });

    describe('editWeight', () => {
        it('should update the weight for a question', async () => {
            db.none.mockResolvedValue();

            await editWeight(1, 2);

            expect(db.none).toHaveBeenCalledWith(
                'UPDATE questions SET weight = $1 WHERE id = $2',
                [2, 1]
            );
        });

        it('should log an error if the database query fails', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await expect(editWeight(1, 2)).rejects.toThrow('DB Error');

            expect(console.error).toHaveBeenCalledWith('Error updating weight for quesiton', 1);
        });
    });

    describe('getQuestionData', () => {
        it('should return question data for a user and exam', async () => {
            const questionData = [
                { question_id: 1, response: 'A', grade: 1 },
                { question_id: 2, response: 'B', grade: 0.5 }
            ];
            db.manyOrNone.mockResolvedValue(questionData);

            const result = await getQuestionData(1, 1);

            expect(db.manyOrNone).toHaveBeenCalledWith(
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
            `, [1, 1]
            );

            expect(result).toEqual(questionData);
        });

        it('should log an error if the database query fails', async () => {
            console.log = jest.fn();
            db.manyOrNone.mockRejectedValue(new Error('DB Error'));

            await getQuestionData(1, 1);

            expect(console.log).toHaveBeenCalledWith('Error getting responses for exam', 1, 'and user', 1);
        });
    });

    describe('getExamAnswers', () => {
        it('should return exam answers for a given exam ID', async () => {
            const examAnswers = [
                { question_id: 1, correct_answer: [1], weight: 1, question_num: 1, num_options: 4 },
                { question_id: 2, correct_answer: [2], weight: 2, question_num: 2, num_options: 4 }
            ];
            db.manyOrNone.mockResolvedValue(examAnswers);

            const result = await getExamAnswers(1);

            expect(db.manyOrNone).toHaveBeenCalledWith(
                'SELECT id AS question_id, correct_answer, weight, question_num, num_options FROM questions WHERE exam_id = $1 ORDER BY question_num',
                [1]
            );

            expect(result).toEqual(examAnswers);
        });

        it('should log an error if the database query fails', async () => {
            console.log = jest.fn();
            db.manyOrNone.mockRejectedValue(new Error('DB Error'));

            await getExamAnswers(1);

            expect(console.log).toHaveBeenCalledWith('Error getting questions for exam', 1, expect.any(Error));
        });
    });

    describe('deleteAnswer', () => {
        it('should delete an answer for a given question ID', async () => {
            db.none.mockResolvedValue();

            await deleteAnswer(1);

            expect(db.none).toHaveBeenCalledWith(
                'DELETE FROM questions WHERE id = $1',
                [1]
            );
        });

        it('should log an error if the database query fails', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await expect(deleteAnswer(1)).rejects.toThrow('DB Error');

            expect(console.error).toHaveBeenCalledWith('Error deleting answer for question', 1);
        });
    });
});
