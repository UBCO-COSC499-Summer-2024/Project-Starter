const { db } = require('../database');
const {
    flagResponse,
    flagExam,
    resolveFlag,
    getFlagged
} = require('../controllers/flagController');

jest.mock('../database', () => ({
    db: {
        oneOrNone: jest.fn(),
        none: jest.fn(),
        manyOrNone: jest.fn()
    }
}));

describe('Flag Controller', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    describe('flagResponse', () => {
        it('should add a flag for a response if the question ID exists', async () => {
            db.oneOrNone.mockResolvedValue({ id: 1 });

            await flagResponse(1, 1, 1, 'This is a flag');

            expect(db.oneOrNone).toHaveBeenCalledWith(
                'SELECT id FROM questions WHERE exam_id = $1 AND question_num = $2',
                [1, 1]
            );

            expect(db.none).toHaveBeenCalledWith(
                'INSERT INTO flags (exam_id, question_id, user_id, issue) VALUES ($1, $2, $3, $4)',
                [1, 1, 1, 'This is a flag']
            );
        });

        it('should not attempt to add a flag if the question ID does not exist', async () => {
            db.oneOrNone.mockResolvedValue(null); // No question ID found

            await flagResponse(1, 1, 1, 'This is a flag');

            expect(db.oneOrNone).toHaveBeenCalledWith(
                'SELECT id FROM questions WHERE exam_id = $1 AND question_num = $2',
                [1, 1]
            );

            expect(db.none).not.toHaveBeenCalled();
        });

        it('should log an error if the database query fails', async () => {
            console.error = jest.fn();
            db.oneOrNone.mockRejectedValue(new Error('DB Error'));

            await flagResponse(1, 1, 1, 'This is a flag');

            expect(console.error).toHaveBeenCalledWith('Error adding response');
        });
    });

    describe('flagExam', () => {
        it('should add a flag for an exam', async () => {
            db.none.mockResolvedValue();

            await flagExam(1, 'This is a flag');

            expect(db.none).toHaveBeenCalledWith(
                'INSERT INTO flags (exam_id, issue) VALUES ($1, $2)',
                [1, 'This is a flag']
            );
        });

        it('should log an error if the database query fails', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await flagExam(1, 'This is a flag');

            expect(console.error).toHaveBeenCalledWith('Error flagging exam', 1);
        });
    });

    describe('resolveFlag', () => {
        it('should resolve a flag if it exists', async () => {
            db.oneOrNone.mockResolvedValue({ id: 1 });

            const result = await resolveFlag(1);

            expect(db.oneOrNone).toHaveBeenCalledWith(
                'DELETE FROM flags WHERE id = $1 RETURNING id',
                [1]
            );

            expect(result).toEqual({ id: 1 });
        });

        it('should throw an error if the flag does not exist', async () => {
            db.oneOrNone.mockResolvedValue(null);

            await expect(resolveFlag(1)).rejects.toThrow('No flag found with the provided ID');

            expect(db.oneOrNone).toHaveBeenCalledWith(
                'DELETE FROM flags WHERE id = $1 RETURNING id',
                [1]
            );
        });

        it('should log an error and throw if the database query fails', async () => {
            console.error = jest.fn();
            db.oneOrNone.mockRejectedValue(new Error('DB Error'));

            await expect(resolveFlag(1)).rejects.toThrow('Failed to resolve flag: DB Error');

            expect(console.error).toHaveBeenCalledWith('Error resolving flag:', 'DB Error');
        });
    });

    describe('getFlagged', () => {
        it('should return flagged responses for an instructor', async () => {
            const flaggedResponses = [
                { id: 1, issue: 'This is a flag' }
            ];
            db.manyOrNone.mockResolvedValue(flaggedResponses);

            const result = await getFlagged(1);

            expect(db.manyOrNone).toHaveBeenCalledWith(
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
                users.role = 2`, [1]
            );

            expect(result).toEqual(flaggedResponses);
        });

        it('should log an error if the database query fails', async () => {
            console.error = jest.fn();
            db.manyOrNone.mockRejectedValue(new Error('DB Error'));

            await getFlagged(1);

            expect(console.error).toHaveBeenCalledWith('Error getting flagged responses for instructor', 1);
        });
    });
});
