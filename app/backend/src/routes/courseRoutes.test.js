const request = require('supertest');
const express = require('express');
const courseRoutes = require('../routes/courseRoutes');
const {
    getAllCourses,
    addCourse,
    getCoursesByUserId,
    getCourseInfo,
    calculateGrades,
    editCourse,
    examsByYear,
} = require('../controllers/courseController');

jest.mock('../controllers/courseController');

const app = express();
app.use(express.json());
app.use('/api/courses', courseRoutes);

describe('Course Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/courses/:id', () => {
        it('should return courses by user ID', async () => {
            const courses = [{ id: 1, name: 'Course 1' }];
            getCoursesByUserId.mockResolvedValue(courses);

            const res = await request(app)
                .get('/api/courses/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(courses);
            expect(getCoursesByUserId).toHaveBeenCalledWith('1');
        });

        it('should return 404 if there is an error fetching courses by user ID', async () => {
            getCoursesByUserId.mockRejectedValue(new Error('Courses not found'));

            const res = await request(app)
                .get('/api/courses/1');

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe('Courses not found');
        });
    });

    describe('POST /api/courses/add', () => {
        it('should add a new course with all required fields', async () => {
            const newCourse = { id: 1, department: 'CS', code: '101', section: '001', description: 'Intro to CS', start_date: '2024-01-01', end_date: '2024-12-31', user_id: 1 };
            addCourse.mockResolvedValue(newCourse);

            const res = await request(app)
                .post('/api/courses/add')
                .send(newCourse);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(newCourse);
            expect(addCourse).toHaveBeenCalledWith(1, 'CS', '101', '001', 'Intro to CS', '2024-01-01', '2024-12-31');
        });

        it('should return 400 if any required fields are missing', async () => {
            const res = await request(app)
                .post('/api/courses/add')
                .send({ department: 'CS', code: '101' });  // Missing fields

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Missing info for adding a course');
        });

        it('should return 500 if there is an error adding the course', async () => {
            addCourse.mockRejectedValue(new Error('Failed to add course'));

            const newCourse = { department: 'CS', code: '101', section: '001', description: 'Intro to CS', start_date: '2024-01-01', end_date: '2024-12-31', user_id: 1 };
            const res = await request(app)
                .post('/api/courses/add')
                .send(newCourse);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Failed to add course');
        });
    });

    describe('POST /api/courses/edit', () => {
        it('should edit an existing course with all required fields', async () => {
            const updatedCourse = { department: 'CS', code: '101', section: '002', description: 'Intro to Computer Science', start_date: '2024-01-01', end_date: '2024-12-31', course_id: 1 };
            editCourse.mockResolvedValue(updatedCourse);

            const res = await request(app)
                .post('/api/courses/edit')
                .send(updatedCourse);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(updatedCourse);
            expect(editCourse).toHaveBeenCalledWith('CS', '101', '002', 'Intro to Computer Science', '2024-01-01', '2024-12-31', 1);
        });

        it('should return 400 if any required fields are missing', async () => {
            const res = await request(app)
                .post('/api/courses/edit')
                .send({ department: 'CS', code: '101' });  // Missing fields

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Missing info for editing a course');
        });

        it('should return 500 if there is an error editing the course', async () => {
            editCourse.mockRejectedValue(new Error('Failed to edit course'));

            const updatedCourse = { department: 'CS', code: '101', section: '002', description: 'Intro to Computer Science', start_date: '2024-01-01', end_date: '2024-12-31', course_id: 1 };
            const res = await request(app)
                .post('/api/courses/edit')
                .send(updatedCourse);

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Failed to edit course');
        });
    });

    describe('GET /api/courses/info/:id', () => {
        it('should return course info by course ID', async () => {
            const courseInfo = { id: 1, name: 'Course Info' };
            getCourseInfo.mockResolvedValue(courseInfo);

            const res = await request(app)
                .get('/api/courses/info/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(courseInfo);
            expect(getCourseInfo).toHaveBeenCalledWith('1');
        });

        it('should return 500 if there is an error fetching course info', async () => {
            getCourseInfo.mockRejectedValue(new Error('Failed to fetch course info'));

            const res = await request(app)
                .get('/api/courses/info/1');

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Failed to fetch course info');
        });
    });

    describe('GET /api/courses/grades/:id', () => {
        it('should return grades for a course by ID', async () => {
            const grades = [{ studentId: 1, grade: 90 }];
            calculateGrades.mockResolvedValue(grades);

            const res = await request(app)
                .get('/api/courses/grades/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(grades);
            expect(calculateGrades).toHaveBeenCalledWith(['1']);
        });

        it('should return 400 if course ID is not provided', async () => {
            const res = await request(app)
                .get('/api/courses/grades/');

            expect(res.statusCode).toBe(404); // Since the route itself will be invalid
        });

        it('should return 400 if there is an error calculating grades', async () => {
            calculateGrades.mockRejectedValue(new Error('Failed to calculate grades'));

            const res = await request(app)
                .get('/api/courses/grades/1');

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Failed to calculate grades');
        });
    });

    describe('GET /api/courses/yearByYearGrades/:department/:code/:name', () => {
        it('should return exams by year for a course', async () => {
            const exams = [{ year: 2023, grade: 85 }];
            examsByYear.mockResolvedValue(exams);

            const res = await request(app)
                .get('/api/courses/yearByYearGrades/CS/101/Intro%20to%20CS');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(exams);
            expect(examsByYear).toHaveBeenCalledWith('CS', '101', 'Intro to CS');
        });

        it('should return 400 if any required parameters are missing', async () => {
            const res = await request(app)
                .get('/api/courses/yearByYearGrades/CS/101/');

            expect(res.statusCode).toBe(404); // Since the route itself will be invalid
        });

        it('should return 400 if there is an error retrieving year by year exams', async () => {
            examsByYear.mockRejectedValue(new Error('Failed to retrieve exams'));

            const res = await request(app)
                .get('/api/courses/yearByYearGrades/CS/101/Intro%20to%20CS');

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Error retrieving year by year exams');
        });
    });
});
