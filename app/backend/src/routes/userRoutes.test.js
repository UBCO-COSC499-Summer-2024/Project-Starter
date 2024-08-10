const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');
const { 
    getStudentsByCourseId, 
    register, 
    addUser, 
    getAllUsers, 
    changeUserRole, 
    addStudent, 
    getScan 
} = require('../controllers/userController');

jest.mock('../controllers/userController');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/users/register', () => {
        it('should register a student to a course', async () => {
            register.mockResolvedValue();

            const res = await request(app)
                .post('/api/users/register')
                .send({ studentId: 1, courseId: 101 });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('student 1 sucessfully registered in 101');
            expect(register).toHaveBeenCalledWith(1, 101);
        });

        it('should return 500 if registration fails', async () => {
            register.mockRejectedValue(new Error('Error registering student 1'));

            const res = await request(app)
                .post('/api/users/register')
                .send({ studentId: 1, courseId: 101 });

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Error registering student 1');
        });
    });

    describe('GET /api/users/:courseId', () => {
        it('should return the list of students in a course', async () => {
            const students = [{ id: 1, name: 'John Doe' }];
            getStudentsByCourseId.mockResolvedValue(students);

            const res = await request(app)
                .get('/api/users/101');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(students);
            expect(getStudentsByCourseId).toHaveBeenCalledWith('101');
        });

        it('should return 400 if an error occurs', async () => {
            getStudentsByCourseId.mockRejectedValue(new Error('Error fetching students'));

            const res = await request(app)
                .get('/api/users/101');

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Error fetching students');
        });
    });

    describe('POST /api/users/add', () => {
        it('should add a new student', async () => {
            addUser.mockResolvedValue();

            const res = await request(app)
                .post('/api/users/add')
                .send({ studentId: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 2 });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Student was added');
            expect(addUser).toHaveBeenCalledWith(1, 'John', 'Doe', 'john.doe@example.com', 2);
        });

        it('should return 500 if adding a student fails', async () => {
            addUser.mockRejectedValue(new Error('Failed to add student'));

            const res = await request(app)
                .post('/api/users/add')
                .send({ studentId: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 2 });

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Failed to add student');
        });
    });

    describe('GET /api/users/get/all', () => {
        it('should return all users', async () => {
            const users = [{ id: 1, name: 'John Doe' }];
            getAllUsers.mockResolvedValue(users);

            const res = await request(app)
                .get('/api/users/get/all');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(users);
            expect(getAllUsers).toHaveBeenCalled();
        });

        it('should return 500 if getting all users fails', async () => {
            getAllUsers.mockRejectedValue(new Error('Error fetching users'));

            const res = await request(app)
                .get('/api/users/get/all');

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('an error occoured while getAllUsers');
        });
    });

    describe('PUT /api/users/changerole/:userId', () => {
        it('should change the role of a user', async () => {
            changeUserRole.mockResolvedValue();

            const res = await request(app)
                .put('/api/users/changerole/1')
                .send({ role: 3 });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('role updated succesfully');
            expect(changeUserRole).toHaveBeenCalledWith('1', 3);
        });

        it('should return 200 with an error message if changing role fails', async () => {
            changeUserRole.mockRejectedValue(new Error('Error changing role'));

            const res = await request(app)
                .put('/api/users/changerole/1')
                .send({ role: 3 });

            expect(res.statusCode).toBe(200);  // Change to the expected status code
            expect(res.body.message).toBe('an error occoured while changeUserRole');
        });
    });

    // Additional tests for the remaining routes...

    describe('POST /api/users/upload', () => {
        it('should upload and parse CSV file successfully', async () => {
            const csvData = `id,first_name,last_name,email,password\n1,John,Doe,john.doe@example.com,\n2,Jane,Doe,jane.doe@example.com,`;
            const courseId = '101';
            addStudent.mockResolvedValue();

            const res = await request(app)
                .post('/api/users/upload')
                .set('courseId', courseId)
                .attach('file', Buffer.from(csvData), 'students.csv');

            expect(res.statusCode).toBe(200);
            expect(res.text).toBe('File uploaded and parsed successfully.');
            expect(addStudent).toHaveBeenCalledTimes(2);
            expect(addStudent).toHaveBeenCalledWith('1', 'John', 'Doe', 'john.doe@example.com', 'changeme', courseId);
            expect(addStudent).toHaveBeenCalledWith('2', 'Jane', 'Doe', 'jane.doe@example.com', 'changeme', courseId);
        });
    });

    describe('GET /api/users/scans/:examId/:userId', () => {
        it('should return the scan path for a given exam and user', async () => {
            const scanPath = { scan: '/path/to/scan.png' };
            getScan.mockResolvedValue(scanPath);

            const res = await request(app)
                .get('/api/users/scans/1/1');

            expect(res.statusCode).toBe(200);
            expect(res.body.path).toBe(scanPath.scan);
            expect(getScan).toHaveBeenCalledWith('1', '1');
        });

        it('should return 400 if an error occurs while fetching the scan', async () => {
            getScan.mockRejectedValue(new Error('Error fetching scan'));

            const res = await request(app)
                .get('/api/users/scans/1/1');

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Error fetching scan');
        });
    });

    describe('GET /api/users/get/sitestatistics', () => {
        it('should return the site statistics', async () => {
            const users = [
                { role: 1 },
                { role: 2 },
                { role: 1 },
            ];
            getAllUsers.mockResolvedValue(users);

            const res = await request(app)
                .get('/api/users/get/sitestatistics');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ 1: 2, 2: 1 });
            expect(getAllUsers).toHaveBeenCalled();
        });

        it('should return 500 if an error occurs while fetching user statistics', async () => {
            getAllUsers.mockRejectedValue(new Error('Error fetching user statistics'));

            const res = await request(app)
                .get('/api/users/get/sitestatistics');

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Error fetching user statistics');
        });
    });
});
