const request = require('supertest');
const express = require('express');
const responseRoutes = require('../routes/responseRoutes');
const {
    addResponse,
    deleteResponses,
} = require('../controllers/responseController');

jest.mock('../controllers/responseController');

const app = express();
app.use(express.json());
app.use('/api/responses', responseRoutes);

describe('Response Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('PUT /api/responses/edit', () => {
        it('should save modified responses for a specific user and exam', async () => {
            addResponse.mockResolvedValue();

            const modifiedResponses = [
                { questionNum: 1, responseArray: [1, 2] },
                { questionNum: 2, responseArray: [3, 4] },
            ];

            const res = await request(app)
                .put('/api/responses/edit')
                .send({
                    exam_id: 101,
                    student_id: 1,
                    modifiedResponses,
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('responses successfully saved for student: 1 on exam: 101');

            expect(addResponse).toHaveBeenCalledTimes(2);
            expect(addResponse).toHaveBeenCalledWith(101, 1, 1, [1, 2], true);
            expect(addResponse).toHaveBeenCalledWith(101, 2, 1, [3, 4], true);
        });
    });
});
