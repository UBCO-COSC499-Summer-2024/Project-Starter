const request = require('supertest');
const express = require('express');
const flagRoutes = require('../routes/flagRoutes');
const {
    flagResponse,
    flagExam,
    resolveFlag,
    getFlagged,
} = require('../controllers/flagController');

jest.mock('../controllers/flagController');

const app = express();
app.use(express.json());
app.use('/api/flags', flagRoutes);

describe('Flag Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/flags/get/:userId', () => {
        it('should return flagged items for a given user ID', async () => {
            const flags = [{ id: 1, issue: 'Issue 1' }];
            getFlagged.mockResolvedValue(flags);

            const res = await request(app)
                .get('/api/flags/get/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(flags);
            expect(getFlagged).toHaveBeenCalledWith('1');
        });

        it('should return 500 if there is an error fetching flagged items', async () => {
            getFlagged.mockRejectedValue(new Error('Failed to fetch flags'));

            const res = await request(app)
                .get('/api/flags/get/1');

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Failed to fetch flags');
        });
    });

    describe('POST /api/flags/resolve', () => {
        it('should resolve a flagged response by ID', async () => {
            resolveFlag.mockResolvedValue();

            const res = await request(app)
                .post('/api/flags/resolve')
                .send({ id: 1 });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Flagged response with ID 1 has been resolved');
            expect(resolveFlag).toHaveBeenCalledWith(1);
        });

        it('should return 400 if flag ID is not provided', async () => {
            const res = await request(app)
                .post('/api/flags/resolve')
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Flag ID is required');
        });

        it('should return 500 if there is an error resolving the flag', async () => {
            resolveFlag.mockRejectedValue(new Error('Failed to resolve flag'));

            const res = await request(app)
                .post('/api/flags/resolve')
                .send({ id: 1 });

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Failed to resolve flag');
        });
    });

    describe('POST /api/flags/set', () => {
        it('should flag a response for a specific exam, user, and question', async () => {
            flagResponse.mockResolvedValue();

            const res = await request(app)
                .post('/api/flags/set')
                .send({ examId: 1, userId: 1, questionNum: 1, flagText: 'Issue with response' });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Added issue for question');
            expect(res.body.questionNum).toBe(1);
            expect(flagResponse).toHaveBeenCalledWith(1, 1, 1, 'Issue with response');
        });

        it('should return 500 if there is an error flagging the response', async () => {
            flagResponse.mockRejectedValue(new Error('Failed to flag response'));

            const res = await request(app)
                .post('/api/flags/set')
                .send({ examId: 1, userId: 1, questionNum: 1, flagText: 'Issue with response' });

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Failed to flag response');
        });
    });
});
