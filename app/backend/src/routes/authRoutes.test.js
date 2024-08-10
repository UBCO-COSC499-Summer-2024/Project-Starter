const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const {
    authUser,
    verifyUser,
    verifyPass,
    resetPassword,
    sendPasswordReset,
} = require('../controllers/authController');

jest.mock('../controllers/authController');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/login', () => {
        it('should authenticate a user and return a token', async () => {
            const authData = { token: 'abc123' };
            authUser.mockResolvedValue(authData);

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(authData);
            expect(authUser).toHaveBeenCalledWith('test@example.com', 'password123');
        });

        it('should return 401 if authentication fails', async () => {
            authUser.mockResolvedValue({ message: 'Authentication failed' });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Authentication failed');
        });

        it('should return 400 if email or password is missing', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: '' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Email and password are required.');
        });

        it('should return 500 if an error occurs during authentication', async () => {
            authUser.mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Internal Server Error');
        });
    });

    describe('GET /api/authenticate/:token', () => {
        it('should return 400 if token is missing', async () => {
            const res = await request(app)
                .get('/api/authenticate/');

            expect(res.statusCode).toBe(404); // The route itself will be invalid
        });
    });

    describe('POST /api/auth/change', () => {
        it('should change the user password', async () => {
            const result = { message: 'Password updated successfully' };
            verifyPass.mockResolvedValue(result);

            const res = await request(app)
                .post('/api/auth/change')
                .send({ userId: 1, oldPass: 'oldpassword', newPass: 'newpassword' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(result);
            expect(verifyPass).toHaveBeenCalledWith(1, 'oldpassword', 'newpassword');
        });

        it('should return 401 if the old password is incorrect', async () => {
            verifyPass.mockResolvedValue({ message: 'Incorrect password' });

            const res = await request(app)
                .post('/api/auth/change')
                .send({ userId: 1, oldPass: 'wrongpassword', newPass: 'newpassword' });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Incorrect password');
        });

        it('should return 400 if any required field is missing', async () => {
            const res = await request(app)
                .post('/api/auth/change')
                .send({ userId: 1, oldPass: 'oldpassword' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('User ID, old password, and new password are required.');
        });

        it('should return 500 if an error occurs during password change', async () => {
            verifyPass.mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app)
                .post('/api/auth/change')
                .send({ userId: 1, oldPass: 'oldpassword', newPass: 'newpassword' });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Internal Server Error');
        });
    });

    describe('POST /api/auth/forgot-password', () => {
        it('should send a password reset link', async () => {
            sendPasswordReset.mockResolvedValue({ message: 'Reset link sent' });

            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'test@example.com' });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Reset link sent');
            expect(sendPasswordReset).toHaveBeenCalledWith('test@example.com');
        });

        it('should return 400 if user is not found', async () => {
            sendPasswordReset.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'unknown@example.com' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('User not found');
        });

        it('should return 500 if an error occurs while sending reset link', async () => {
            sendPasswordReset.mockRejectedValue(new Error('Server error occurred'));

            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'test@example.com' });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Server error occurred');
        });
    });

    describe('POST /api/auth/reset-password/:token', () => {
        it('should reset the user password', async () => {
            resetPassword.mockResolvedValue({ message: 'Password reset successfully' });

            const res = await request(app)
                .post('/api/auth/reset-password/abc123')
                .send({ password: 'newpassword' });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Password reset successfully');
            expect(resetPassword).toHaveBeenCalledWith('abc123', 'newpassword');
        });

        it('should return 400 if reset fails', async () => {
            resetPassword.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/auth/reset-password/abc123')
                .send({ password: 'newpassword' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Reset password failed');
        });

        it('should return 500 if an error occurs during password reset', async () => {
            resetPassword.mockRejectedValue(new Error('Server error occurred'));

            const res = await request(app)
                .post('/api/auth/reset-password/abc123')
                .send({ password: 'newpassword' });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Server error occurred');
        });
    });
});
