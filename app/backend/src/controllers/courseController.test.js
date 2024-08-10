const { db } = require('../database');
const { register } = require('../controllers/userController');
const {
    getAllCourses,
    addCourse,
    getCoursesByUserId,
    getCourseInfo,
    calculateGrades,
    editCourse,
    examsByYear
} = require('../controllers/courseController');

jest.mock('../database', () => ({
    db: {
        oneOrNone: jest.fn(),
        none: jest.fn(),
        manyOrNone: jest.fn(),
        any: jest.fn()
    }
}));

jest.mock('../controllers/userController', () => ({
    register: jest.fn()
}));

describe('Course Controller', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    describe('addCourse', () => {
        it('should return null if dates are invalid', async () => {
            const invalidCourse = {
                user_id: 1,
                department: 'CS',
                code: '101',
                section: 1,
                description: 'Intro to CS',
                start_date: 'invalid-date',
                end_date: 'invalid-date'
            };

            const result = await addCourse(invalidCourse.user_id, invalidCourse.department, invalidCourse.code, invalidCourse.section, invalidCourse.description, invalidCourse.start_date, invalidCourse.end_date);

            expect(db.oneOrNone).not.toHaveBeenCalled();
            expect(register).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('should log an error if the database query fails', async () => {
            console.error = jest.fn();
            db.oneOrNone.mockRejectedValue(new Error('DB Error'));

            const course = {
                user_id: 1,
                department: 'CS',
                code: '101',
                section: 1,
                description: 'Intro to CS',
                start_date: '2024-01-01',
                end_date: '2024-06-01'
            };

            await addCourse(course.user_id, course.department, course.code, course.section, course.description, course.start_date, course.end_date);

            expect(console.error).toHaveBeenCalledWith('Error adding course CS 101-1', expect.any(Error));
        });
    });

    describe('editCourse', () => {
        it('should edit an existing course', async () => {
            const course = {
                department: 'CS',
                code: '101',
                section: 1,
                description: 'Intro to CS',
                start_date: '2024-01-01',
                end_date: '2024-06-01',
                courseId: 1
            };
            db.none.mockResolvedValue();

            await editCourse(course.department, course.code, course.section, course.description, course.start_date, course.end_date, course.courseId);

            expect(db.none).toHaveBeenCalledWith(
                'UPDATE courses SET department = $1, code = $2, section = $3, description = $4, start_date = $5, end_date = $6 WHERE id = $7',
                [course.department, course.code, course.section, course.description, course.start_date, course.end_date, course.courseId]
            );
        });

        it('should log an error if the database query fails', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            const course = {
                department: 'CS',
                code: '101',
                section: 1,
                description: 'Intro to CS',
                start_date: '2024-01-01',
                end_date: '2024-06-01',
                courseId: 1
            };

            await editCourse(course.department, course.code, course.section, course.description, course.start_date, course.end_date, course.courseId);

            expect(console.error).toHaveBeenCalledWith('Error updating course ', 'CS 101-1');
        });
    });

    describe('getAllCourses', () => {
        it('should return all courses', async () => {
            const courses = [
                { id: 1, department: 'CS', code: '101', section: 1, description: 'Intro to CS' }
            ];
            db.any.mockResolvedValue(courses);

            const req = {};
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            await getAllCourses(req, res);

            expect(db.any).toHaveBeenCalledWith('SELECT * FROM courses');
            expect(res.json).toHaveBeenCalledWith(courses);
        });

        it('should return a 500 status if there is an error fetching courses', async () => {
            console.error = jest.fn();
            db.any.mockRejectedValue(new Error('DB Error'));

            const req = {};
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            await getAllCourses(req, res);

            expect(console.error).toHaveBeenCalledWith('Error fetching courses:', expect.any(Error));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('getCoursesByUserId', () => {
        it('should return courses for a given user ID', async () => {
            const courses = [
                { course_id: 1, department: 'CS', code: '101', section: 1, description: 'Intro to CS' }
            ];
            db.manyOrNone.mockResolvedValue(courses);

            const result = await getCoursesByUserId(1);

            expect(db.manyOrNone).toHaveBeenCalledWith(
                'SELECT course_id, department, code, section, description, start_date, end_date FROM users JOIN registration ON registration.user_id = users.id JOIN courses ON registration.course_id = courses.id WHERE users.id = $1 ORDER BY department',
                [1]
            );
            expect(result).toEqual(courses);
        });

        it('should log an error if the database query fails', async () => {
            console.log = jest.fn();
            db.manyOrNone.mockRejectedValue(new Error('DB Error'));

            await getCoursesByUserId(1);

            expect(console.log).toHaveBeenCalledWith('Error getting course data for id 1', expect.any(Error));
        });
    });

    describe('getCourseInfo', () => {
        it('should return course information for a given course ID', async () => {
            const courseInfo = { id: 1, department: 'CS', code: '101', section: 1, description: 'Intro to CS' };
            db.oneOrNone.mockResolvedValue(courseInfo);

            const result = await getCourseInfo(1);

            expect(db.oneOrNone).toHaveBeenCalledWith('SELECT * FROM courses WHERE id = $1', [1]);
            expect(result).toEqual(courseInfo);
        });

        it('should log an error if the database query fails', async () => {
            console.error = jest.fn();
            db.oneOrNone.mockRejectedValue(new Error('DB Error'));

            await getCourseInfo(1);

            expect(console.error).toHaveBeenCalledWith('Error getting course data for course id 1', expect.any(Error));
        });
    });

    describe('calculateGrades', () => {
        it('should return calculated grades for a course', async () => {
            const grades = [
                { userId: 1, lastName: 'Doe', firstName: 'John', studentScore: 90, maxScore: 100 }
            ];
            db.manyOrNone.mockResolvedValue(grades);

            const result = await calculateGrades(1);

            expect(db.manyOrNone).toHaveBeenCalledWith(expect.any(String));
            expect(result).toEqual(grades);
        });

        it('should log an error if the database query fails', async () => {
            console.error = jest.fn();
            db.manyOrNone.mockRejectedValue(new Error('DB Error'));

            await calculateGrades(1);

            expect(console.error).toHaveBeenCalledWith('Error calculating grades');
        });
    });

    describe('examsByYear', () => {
        it('should log an error if no exams are found or database query fails', async () => {
            console.error = jest.fn();
            db.manyOrNone.mockResolvedValue([]);

            await examsByYear('CS', '101', 'Final');

            expect(console.error).toHaveBeenCalledWith('Error calculating grades');
        });
    });
});
