const { db } = require('../database');
const {
    addTest,
    addExam,
    editTest,
    deleteTest,
    getTestsByCourseId,
    getRecentExamsByUserId,
    setExamMarked,
    addStudentAnswers,
    addAnswerKey,
    getTestGrades,
    updateVisibility
} = require('../controllers/testController');
const { addScan } = require('../controllers/userController');
const { addQuestion } = require('../controllers/questionController');
const { flagExam, flagResponse } = require('../controllers/flagController');
const { addResponse } = require('../controllers/responseController');
const fs = require('fs');

jest.mock('../database', () => ({
    db: {
        one: jest.fn(),
        none: jest.fn(),
        manyOrNone: jest.fn(),
        oneOrNone: jest.fn(),
        any: jest.fn()
    }
}));

jest.mock('../controllers/userController', () => ({
    addScan: jest.fn()
}));

jest.mock('../controllers/questionController', () => ({
    addQuestion: jest.fn()
}));

jest.mock('../controllers/flagController', () => ({
    flagExam: jest.fn(),
    flagResponse: jest.fn()
}));

jest.mock('../controllers/responseController', () => ({
    addResponse: jest.fn()
}));

jest.mock('fs', () => ({
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    writeFileSync: jest.fn()
}));

describe('Test Controller', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    describe('addTest', () => {
        it('should add a test and its questions to the database', async () => {
            const req = {
                body: {
                    name: 'Test 1',
                    questions: [
                        { correctAnswer: [1], num_options: 4, weight: 1 },
                        { correctAnswer: [2], num_options: 4, weight: 2 }
                    ],
                    courseId: 1,
                    visibility: true
                }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            db.one.mockResolvedValue({ id: 1 });

            await addTest(req, res);

            expect(db.one).toHaveBeenCalledWith(
                'INSERT INTO exams (name, course_id, visibility) VALUES ($1, $2, $3) RETURNING id',
                ['Test 1', 1, true]
            );

            expect(db.none).toHaveBeenCalledWith(
                'INSERT INTO questions (exam_id, correct_answer, num_options, weight) VALUES ($1, $2::integer[], $3, $4)',
                [1, [1], 4, 1]
            );
            expect(db.none).toHaveBeenCalledWith(
                'INSERT INTO questions (exam_id, correct_answer, num_options, weight) VALUES ($1, $2::integer[], $3, $4)',
                [1, [2], 4, 2]
            );

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                id: 1,
                name: 'Test 1',
                courseId: 1,
                questions: req.body.questions
            });
        });

        it('should return 500 if there is an error adding the test', async () => {
            const req = {
                body: {
                    name: 'Test 1',
                    questions: [],
                    courseId: 1,
                    visibility: true
                }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            db.one.mockRejectedValue(new Error('DB Error'));

            await addTest(req, res);

            expect(db.one).toHaveBeenCalledWith(
                'INSERT INTO exams (name, course_id, visibility) VALUES ($1, $2, $3) RETURNING id',
                ['Test 1', 1, true]
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });

    describe('addExam', () => {
        it('should add an exam to the database and return its ID', async () => {
            db.any.mockResolvedValue([{ id: 1 }]);

            const result = await addExam(1, 'Exam 1');

            expect(db.any).toHaveBeenCalledWith(
                'INSERT INTO exams (course_id, name) VALUES ($1, $2) RETURNING id',
                [1, 'Exam 1']
            );
            expect(result).toEqual([{ id: 1 }]);
        });

        it('should log an error if there is an issue adding the exam', async () => {
            console.error = jest.fn();
            db.any.mockRejectedValue(new Error('DB Error'));

            await addExam(1, 'Exam 1');

            expect(console.error).toHaveBeenCalledWith('Error adding the exam Exam 1');
        });
    });

    describe('editTest', () => {
        it('should edit the name of an existing test', async () => {
            db.none.mockResolvedValue();

            await editTest(1, 'New Test Name');

            expect(db.none).toHaveBeenCalledWith(
                'UPDATE exams SET name = $1 WHERE id = $2',
                ['New Test Name', 1]
            );
        });

        it('should log an error if there is an issue editing the test', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await expect(editTest(1, 'New Test Name')).rejects.toThrow('DB Error');

            expect(console.error).toHaveBeenCalledWith('Error editing test with id 1:', expect.any(Error));
        });
    });

    describe('deleteTest', () => {
        it('should delete an existing test by ID', async () => {
            db.none.mockResolvedValue();

            await deleteTest(1);

            expect(db.none).toHaveBeenCalledWith(
                'DELETE FROM exams WHERE id = $1',
                [1]
            );
        });

        it('should log an error if there is an issue deleting the test', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await expect(deleteTest(1)).rejects.toThrow('DB Error');

            expect(console.error).toHaveBeenCalledWith('Error deleting test with id 1:', expect.any(Error));
        });
    });

    describe('getTestsByCourseId', () => {
        it('should return tests by course ID with calculated mean grades', async () => {
            const tests = [{ id: 1, name: 'Test 1' }];
            db.manyOrNone.mockResolvedValue(tests);
            db.oneOrNone.mockResolvedValue({ mean_grade: 85 });

            const result = await getTestsByCourseId(1);

            expect(db.manyOrNone).toHaveBeenCalledWith(
                'SELECT exams.id, date_marked, exams.name, courses.department, courses.code, courses.section, visibility FROM exams JOIN courses ON exams.course_id = courses.id WHERE course_id = $1 ORDER BY date_marked DESC',
                [1]
            );

            expect(db.oneOrNone).toHaveBeenCalledWith(
                expect.any(String),
                [1]
            );

            expect(result[0]).toHaveProperty('mean', 85);
        });

        it('should log an error if there is an issue getting the tests', async () => {
            console.error = jest.fn();
            db.manyOrNone.mockRejectedValue(new Error('DB Error'));

            await getTestsByCourseId(1);

            expect(console.error).toHaveBeenCalledWith('Error getting course data for id 1', expect.any(Error));
        });
    });

    describe('getRecentExamsByUserId', () => {
        it('should return recent exams by user ID', async () => {
            const exams = [{ id: 1, name: 'Exam 1' }];
            db.manyOrNone.mockResolvedValue(exams);

            const result = await getRecentExamsByUserId(1);

            expect(db.manyOrNone).toHaveBeenCalledWith(
                'SELECT exams.id, date_marked, exams.name, courses.department, courses.code, courses.section AS course_name FROM users INNER JOIN registration ON users.id = registration.user_id INNER JOIN courses ON registration.course_id = courses.id INNER JOIN exams ON courses.id = exams.course_id WHERE users.id = $1 ORDER BY date_marked DESC',
                [1]
            );

            expect(result).toEqual(exams);
        });

        it('should log an error if there is an issue getting the recent exams', async () => {
            console.log = jest.fn();
            db.manyOrNone.mockRejectedValue(new Error('DB Error'));

            await getRecentExamsByUserId(1);

            expect(console.log).toHaveBeenCalledWith('Error getting recent courses for user id 1', expect.any(Error));
        });
    });

    describe('setExamMarked', () => {
        it('should set the date marked for an exam', async () => {
            const currentDate = new Date().toISOString().split('T')[0];
            db.none.mockResolvedValue();

            await setExamMarked(1);

            expect(db.none).toHaveBeenCalledWith(
                'UPDATE exams SET date_marked = $1 WHERE id = $2',
                [currentDate, 1]
            );
        });

        it('should log an error if there is an issue setting the exam marked date', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await expect(setExamMarked(1)).rejects.toThrow('DB Error');

            expect(console.error).toHaveBeenCalledWith('Error updating exam marked date for exam:', 1);
        });
    });

    describe('addAnswerKey', () => {
        it('should process and store the answer key and scan image', async () => {
            const jsonData = {
                answer1: {
                    answers: [
                        [{ LetterPos: 'A', Question: 1 }],
                        [], // No response questions
                        []  // Multiple responses questions
                    ],
                    combined_page: 'imagebase64'
                }
            };

            fs.existsSync.mockReturnValue(false);
            fs.mkdirSync.mockReturnValue();
            fs.writeFileSync.mockReturnValue();

            await addAnswerKey(jsonData, 1, 1);

            expect(fs.existsSync).toHaveBeenCalledWith('/code/images');
            expect(fs.mkdirSync).toHaveBeenCalledWith('/code/images', { recursive: true });
            expect(fs.writeFileSync).toHaveBeenCalledWith('/code/images/1_1.png', expect.any(Buffer));

            expect(addQuestion).toHaveBeenCalledWith(1, 5, 'A', 1, 1);
            expect(addScan).toHaveBeenCalledWith(1, 1, '/images/1_1.png');
        });
    });

    describe('updateVisibility', () => {
        it('should update the visibility of a test', async () => {
            db.none.mockResolvedValue();

            const result = await updateVisibility(1, true);

            expect(db.none).toHaveBeenCalledWith(
                'UPDATE exams SET visibility = $1 WHERE id = $2',
                [true, 1]
            );
            expect(result).toBe(true);
        });

        it('should log an error if there is an issue updating the visibility', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            const result = await updateVisibility(1, true);

            expect(console.error).toHaveBeenCalledWith('Error updating test with id', 1);
            expect(result).toBe(false);
        });
    });
});
