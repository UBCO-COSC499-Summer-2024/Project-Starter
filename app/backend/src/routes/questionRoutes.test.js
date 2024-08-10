const request = require('supertest');
const express = require('express');
const questionRoutes = require('../routes/questionRoutes');
const {
    addQuestion,
    editAnswer,
    getQuestionData,
    getExamAnswers,
    deleteAnswer,
    editWeight,
} = require('../controllers/questionController');

jest.mock('../controllers/questionController');

const app = express();
app.use(express.json());
app.use('/api/questions', questionRoutes);

describe('Question Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/questions/responses/:eid&:uid', () => {
        it('should return question data for a given user and exam', async () => {
            const questions = [{ id: 1, text: 'Question 1' }];
            getQuestionData.mockResolvedValue(questions);

            const res = await request(app)
                .get('/api/questions/responses/101&1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(questions);
            expect(getQuestionData).toHaveBeenCalledWith('1', '101');
        });

        it('should return 404 if there is an error fetching question data', async () => {
            getQuestionData.mockRejectedValue(new Error('Questions not found'));

            const res = await request(app)
                .get('/api/questions/responses/101&1');

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe('Questions not found');
        });
    });

    describe('GET /api/questions/answers/:examId', () => {
        it('should return exam answers for a given exam ID', async () => {
            const answers = [{ questionId: 1, correctAnswer: 'A' }];
            getExamAnswers.mockResolvedValue(answers);

            const res = await request(app)
                .get('/api/questions/answers/101');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(answers);
            expect(getExamAnswers).toHaveBeenCalledWith('101');
        });

        it('should return 400 if examId is missing', async () => {
            const res = await request(app)
                .get('/api/questions/answers/');

            expect(res.statusCode).toBe(404); // Since the route itself will be invalid
        });

        it('should return 500 if there is an error fetching exam answers', async () => {
            getExamAnswers.mockRejectedValue(new Error('Failed to fetch exam answers'));

            const res = await request(app)
                .get('/api/questions/answers/101');

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Failed to fetch exam answers');
        });
    });

    describe('POST /api/questions/edit/:questionId', () => {
        it('should edit the weight of a question', async () => {
            editWeight.mockResolvedValue();

            const res = await request(app)
                .post('/api/questions/edit/1')
                .send({ weight: 2.5 });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Weight edited successfully');
            expect(editWeight).toHaveBeenCalledWith('1', 2.5);
        });

        it('should edit the correct answer of a question', async () => {
            editAnswer.mockResolvedValue();

            const res = await request(app)
                .post('/api/questions/edit/1')
                .send({ correct_answer: [1, 2] });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Answer edited successfully');
            expect(editAnswer).toHaveBeenCalledWith('1', [1, 2]);
        });

        it('should return 400 if neither weight nor correct answer is provided', async () => {
            const res = await request(app)
                .post('/api/questions/edit/1')
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Error editing question');
        });

        it('should return 400 if there is an error editing the question', async () => {
            editAnswer.mockRejectedValue(new Error('Edit failed'));

            const res = await request(app)
                .post('/api/questions/edit/1')
                .send({ correct_answer: [1, 2] });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Edit failed');
        });
    });

    describe('DELETE /api/questions/delete/:questionId', () => {
        it('should delete a question by ID', async () => {
            deleteAnswer.mockResolvedValue();

            const res = await request(app)
                .delete('/api/questions/delete/1');

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Deleted question with ID 1');
            expect(deleteAnswer).toHaveBeenCalledWith('1');
        });
    });
});
