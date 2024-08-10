const { db } = require('../database');
const { addResponse, deleteResponses } = require('../controllers/responseController');

jest.mock('../database', () => ({
    db: {
        oneOrNone: jest.fn(),
        none: jest.fn()
    }
}));

describe('Response Controller', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    describe('addResponse', () => {
        it('should add a response if the question ID exists', async () => {
            db.oneOrNone.mockResolvedValue({ id: 1 });

            await addResponse(1, 1, 1, 'A', false);

            expect(db.oneOrNone).toHaveBeenCalledWith(
                'SELECT id FROM questions WHERE exam_id = $1 AND question_num = $2',
                [1, 1]
            );

            expect(db.none).toHaveBeenCalledWith(
                'INSERT INTO responses (question_id, user_id, response, question_num, was_modified) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (question_id, user_id) DO UPDATE SET response = excluded.response, was_modified = excluded.was_modified',
                [1, 1, 'A', 1, false]
            );
        });

        it('should not attempt to add a response if the question ID does not exist', async () => {
            db.oneOrNone.mockResolvedValue(null); // No question ID found

            await addResponse(1, 1, 1, 'A', false);

            expect(db.oneOrNone).toHaveBeenCalledWith(
                'SELECT id FROM questions WHERE exam_id = $1 AND question_num = $2',
                [1, 1]
            );

            expect(db.none).not.toHaveBeenCalled();
        });

        it('should log an error if the database query fails', async () => {
            console.error = jest.fn();
            db.oneOrNone.mockRejectedValue(new Error('DB Error'));

            await addResponse(1, 1, 1, 'A', false);

            expect(console.error).toHaveBeenCalledWith('Error adding response');
        });
    });

    describe('deleteResponses', () => {
        it('should delete responses for a given user and exam', async () => {
            db.none.mockResolvedValue();

            await deleteResponses(1, 101);

            expect(db.none).toHaveBeenCalledWith(
                `DELETE 
        FROM responses 
        WHERE 
            question_id IN (
                SELECT
                    questions.id 
                FROM 
                    questions 
                WHERE
                    exam_id = 101
            )
            AND user_id = 1;`
            );
        });

        it('should log an error and throw it if the database query fails', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await expect(deleteResponses(1, 101)).rejects.toThrow('DB Error');

            expect(console.error).toHaveBeenCalledWith('Error deleting responses for user: 1 on exam 101');
        });
    });
});
