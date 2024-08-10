const bcrypt = require('bcrypt');
const { db } = require('../database');
const {
    getStudentsByCourseId,
    addStudent,
    addScan,
    getScan,
    getAllUsers,
    changeUserRole,
    getUserStatistics,
    register,
    addUser
} = require('../controllers/userController');

// Mock the db methods
jest.mock('../database', () => ({
    db: {
        manyOrNone: jest.fn(),
        none: jest.fn(),
        oneOrNone: jest.fn(),
        any: jest.fn()
    }
}));

describe('User Controller', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    describe('getStudentsByCourseId', () => {
        it('should return students for a given course ID', async () => {
            const students = [{ id: 1, first_name: 'John', last_name: 'Doe', role: 1 }];
            db.manyOrNone.mockResolvedValue(students);

            const result = await getStudentsByCourseId(1);
            expect(result).toEqual(students);
            expect(db.manyOrNone).toHaveBeenCalledWith(expect.any(String), [1]);
        });

        it('should log an error if db query fails', async () => {
            console.log = jest.fn();
            db.manyOrNone.mockRejectedValue(new Error('DB Error'));

            await getStudentsByCourseId(1);
            expect(console.log).toHaveBeenCalledWith('Error getting students for course:', 1);
        });
    });

    describe('addStudent', () => {
        it('should add a new student with a hashed password and register them for a course', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');
            db.none.mockResolvedValue();

            await addStudent(1, 'John', 'Doe', 'john@example.com', 'password123', 101);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(db.none).toHaveBeenCalledWith(
                expect.any(String),
                [1, 'John', 'Doe', 'john@example.com', 'hashedpassword']
            );
            expect(db.none).toHaveBeenCalledTimes(2); // Once for adding student, once for registration
        });

        it('should log an error if db query fails', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await addStudent(1, 'John', 'Doe', 'john@example.com', 'password123', 101);

            expect(console.error).toHaveBeenCalledWith('Error adding student John, Doe');
        });
    });

    describe('addScan', () => {
        it('should add a scan for a user and exam', async () => {
            db.none.mockResolvedValue();

            await addScan(101, 1, 'path/to/scan.png');

            expect(db.none).toHaveBeenCalledWith(
                'INSERT INTO scans (exam_id, user_id, scan) VALUES ($1, $2, $3)',
                [101, 1, 'path/to/scan.png']
            );
        });

        it('should log an error if db query fails', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await addScan(101, 1, 'path/to/scan.png');

            expect(console.error).toHaveBeenCalledWith('Error adding scan for user', 1);
        });
    });

    describe('getScan', () => {
        it('should return scan path for a given exam and user', async () => {
            const scan = { scan: 'path/to/scan.png' };
            db.oneOrNone.mockResolvedValue(scan);

            const result = await getScan(101, 1);
            expect(result).toEqual(scan);
            expect(db.oneOrNone).toHaveBeenCalledWith(
                'SELECT scan FROM scans WHERE exam_id = $1 AND user_id = $2',
                [101, 1]
            );
        });

        it('should log an error if db query fails', async () => {
            console.error = jest.fn();
            db.oneOrNone.mockRejectedValue(new Error('DB Error'));

            await expect(getScan(101, 1)).rejects.toThrow('DB Error');
            expect(console.error).toHaveBeenCalledWith('Error getting scan for user', 1, 'and exam', 101);
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = [{ id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', role: 1 }];
            db.manyOrNone.mockResolvedValue(users);

            const result = await getAllUsers();
            expect(result).toEqual(users);
            expect(db.manyOrNone).toHaveBeenCalledWith(expect.any(String));
        });

        it('should log an error if db query fails', async () => {
            console.error = jest.fn();
            db.manyOrNone.mockRejectedValue(new Error('DB Error'));

            await expect(getAllUsers()).rejects.toThrow('DB Error');
            expect(console.error).toHaveBeenCalledWith('Error Fetching Users:', expect.any(Error));
        });
    });

    describe('changeUserRole', () => {
        it('should change the role of a user', async () => {
            db.none.mockResolvedValue();

            const result = await changeUserRole(1, 2);
            expect(result).toBe(true);
            expect(db.none).toHaveBeenCalledWith(
                'UPDATE users SET role = $1 WHERE id = $2',
                [2, 1]
            );
        });

        it('should log an error if db query fails', async () => {
            console.log = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await expect(changeUserRole(1, 2)).rejects.toThrow('DB Error');
            expect(console.log).toHaveBeenCalledWith('Error when updating role', expect.any(Error));
        });
    });

    describe('getUserStatistics', () => {
        it('should return user statistics', async () => {
            const stats = [{ role: 1, count: 10 }];
            db.any.mockResolvedValue(stats);

            const result = await getUserStatistics();
            expect(result).toEqual(stats);
            expect(db.any).toHaveBeenCalledWith('SELECT role, COUNT(*) as count FROM users GROUP BY role');
        });

        it('should log an error if db query fails', async () => {
            console.error = jest.fn();
            db.any.mockRejectedValue(new Error('DB Error'));

            await expect(getUserStatistics()).rejects.toThrow('DB Error');
            expect(console.error).toHaveBeenCalledWith('Error fetching user statistics:', expect.any(Error));
        });
    });

    describe('register', () => {
        it('should register a user to a course', async () => {
            db.none.mockResolvedValue();

            await register(1, 101);

            expect(db.none).toHaveBeenCalledWith(
                'INSERT INTO registration (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING',
                [1, 101]
            );
        });

        it('should log an error if db query fails', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await register(1, 101);

            expect(console.error).toHaveBeenCalledWith('Error registering user with ID ', 1, 'into course with ID', 101);
        });
    });

    describe('addUser', () => {
        it('should add a new user with a hashed password', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');
            db.none.mockResolvedValue();

            await addUser(1, 'John', 'Doe', 'john@example.com', 1);

            expect(bcrypt.hash).toHaveBeenCalledWith('changeme', 10);
            expect(db.none).toHaveBeenCalledWith(
                'INSERT INTO users (id, first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING',
                [1, 'John', 'Doe', 'john@example.com', 'hashedpassword', 1]
            );
        });

        it('should log an error if db query fails', async () => {
            console.error = jest.fn();
            db.none.mockRejectedValue(new Error('DB Error'));

            await addUser(1, 'John', 'Doe', 'john@example.com', 1);

            expect(console.error).toHaveBeenCalledWith('Error adding user', 'John', 'Doe', expect.any(Error));
        });
    });
});
