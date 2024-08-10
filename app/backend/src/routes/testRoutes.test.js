const request = require('supertest');
const express = require('express');
const testRoutes = require('../routes/testRoutes');
const {
    getTestsByCourseId,
    getRecentExamsByUserId,
    addTest,
    deleteTest,
    editTest,
    addAnswerKey,
    addStudentAnswers,
    getTestGrades,
    updateVisibility,
} = require('../controllers/testController');

jest.mock('../controllers/testController');

const app = express();
app.use(express.json());
app.use('/api/users/tests', testRoutes);

describe('Test Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('DELETE /api/users/tests/delete/:id', () => {
        it('should delete a test by id', async () => {
            deleteTest.mockResolvedValue();

            const res = await request(app)
                .delete('/api/users/tests/delete/1');

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Test with id 1 deleted successfully');
            expect(deleteTest).toHaveBeenCalledWith('1');
        });

        it('should return 500 if deleting a test fails', async () => {
            deleteTest.mockRejectedValue(new Error('Deletion failed'));

            const res = await request(app)
                .delete('/api/users/tests/delete/1');

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Deletion failed');
        });
    });

    describe('PUT /api/users/tests/edit/:id', () => {
        it('should edit a test name by id', async () => {
            editTest.mockResolvedValue();

            const res = await request(app)
                .put('/api/users/tests/edit/1')
                .send({ name: 'New Test Name' });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Test with id 1 edited successfully');
            expect(editTest).toHaveBeenCalledWith('1', 'New Test Name');
        });

        it('should return 500 if editing a test fails', async () => {
            editTest.mockRejectedValue(new Error('Edit failed'));

            const res = await request(app)
                .put('/api/users/tests/edit/1')
                .send({ name: 'New Test Name' });

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Edit failed');
        });
    });

    describe('GET /api/users/tests/:id', () => {
        it('should return tests by course id', async () => {
            const tests = [{ id: 1, name: 'Test 1' }];
            getTestsByCourseId.mockResolvedValue(tests);

            const res = await request(app)
                .get('/api/users/tests/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(tests);
            expect(getTestsByCourseId).toHaveBeenCalledWith('1');
        });

        it('should return 404 if no tests are found', async () => {
            getTestsByCourseId.mockRejectedValue(new Error('Tests not found'));

            const res = await request(app)
                .get('/api/users/tests/1');

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe('Tests not found');
        });
    });

    describe('POST /api/users/tests/upload/answers', () => {
        it('should upload answer key and return success message', async () => {
            const pythonResponse = { data: [{ question: 1, answer: 'A' }] };
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve(pythonResponse),
                })
            );
            addAnswerKey.mockResolvedValue();

            const res = await request(app)
                .post('/api/users/tests/upload/answers')
                .set('testid', '1')
                .set('numquestions', '10')
                .attach('file', Buffer.from('dummy data'), 'answers.csv');

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('This will always pass');
            expect(addAnswerKey).toHaveBeenCalledWith(pythonResponse.data, '1', undefined);
        });
    });

    describe('POST /api/users/tests/upload/responses', () => {
        it('should upload student responses and return flags', async () => {
            const pythonResponse = { data: [{ question: 1, answer: 'A' }] };
            const flags = [{ questionId: 1, issue: 'Answer missing' }];
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve(pythonResponse),
                })
            );
            addStudentAnswers.mockResolvedValue(flags);

            const res = await request(app)
                .post('/api/users/tests/upload/responses')
                .set('testid', '1')
                .set('numquestions', '10')
                .attach('file', Buffer.from('dummy data'), 'responses.csv');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(flags);
            expect(addStudentAnswers).toHaveBeenCalledWith(pythonResponse.data, '1');
        });
    });

    describe('GET /api/users/tests/grades/:testId', () => {
        it('should return test grades by test id', async () => {
            const grades = [{ studentId: 1, grade: 95 }];
            getTestGrades.mockResolvedValue(grades);

            const res = await request(app)
                .get('/api/users/tests/grades/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(grades);
            expect(getTestGrades).toHaveBeenCalledWith('1');
        });

        it('should return 500 if fetching grades fails', async () => {
            getTestGrades.mockRejectedValue(new Error('Failed to fetch grades'));

            const res = await request(app)
                .get('/api/users/tests/grades/1');

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Failed to fetch grades');
        });
    });

    describe('GET /api/users/tests/set/visibility/:testId/:visibility', () => {
        it('should update visibility of the test', async () => {
            updateVisibility.mockResolvedValue(true);

            const res = await request(app)
                .get('/api/users/tests/set/visibility/1/true');

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Updated visibility successfully');
            expect(updateVisibility).toHaveBeenCalledWith('1', 'true');
        });

        it('should return 400 if visibility update fails', async () => {
            updateVisibility.mockResolvedValue(false);

            const res = await request(app)
                .get('/api/users/tests/set/visibility/1/true');

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Error occured. Response not ok from updateVisibility');
        });

        it('should return 500 if there is an error updating visibility', async () => {
            updateVisibility.mockRejectedValue(new Error('Failed to change visibility'));

            const res = await request(app)
                .get('/api/users/tests/set/visibility/1/true');

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Failed to change visibility');
        });
    });
});
