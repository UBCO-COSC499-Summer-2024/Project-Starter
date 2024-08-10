const { db } = require('../database');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const getStudentsByCourseId = async (courseId) => {
    try {
        const response = await db.manyOrNone(
            'SELECT u.id, u.first_name, u.last_name, u.role FROM users u JOIN registration r ON u.id = r.user_id JOIN courses c ON r.course_id = c.id WHERE c.id = $1 ORDER BY last_name ASC, first_name ASC', [courseId]
        );
        return response;
    } catch(error) {
        console.log('Error getting students for course:',courseId);
    }
}

const addStudent = async (id, first, last, email, password, courseId) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.none(
            'INSERT INTO users (id, first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5, 1) ON CONFLICT (email) DO NOTHING', [id, first, last, email, hashedPassword]
        );
        if(courseId) {
            register(id, courseId)
        }
    } catch(error) {
        console.error(`Error adding student ${first}, ${last}`);
    };
};

const addUser = async (id, first, last, email, role) => {
    try {
        console.log(id, first, last, email, role)
        const hashedPassword = await bcrypt.hash('changeme', 10);
        await db.none(
            'INSERT INTO users (id, first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING', [id, first, last, email, hashedPassword, role]
        );
    } catch(error) {
        console.error('Error adding user',first,last, error)
    }
}

const addScan = async (exam_id, user_id, path) => {
    try {
        await db.none(
            'INSERT INTO scans (exam_id, user_id, scan) VALUES ($1, $2, $3)', [exam_id, user_id, path]
        );
    } catch(error) {
        console.error('Error adding scan for user',user_id);
    }
};

const getScan = async (exam_id, user_id) => {
    try {
        response = await db.oneOrNone(
            'SELECT scan FROM scans WHERE exam_id = $1 AND user_id = $2', [exam_id, user_id]
        );
        return response;
    } catch(error) {
        console.error('Error getting scan for user',user_id,'and exam',exam_id);
        throw error;
    }
};

const getAllUsers = async() =>  { 
    try{
        const users = await db.manyOrNone('SELECT id, first_name, last_name, email, role FROM users ORDER BY role DESC, last_name');
        return users;

    }catch(error){
        console.error('Error Fetching Users:', error);
        throw error;
    }
}

const changeUserRole = async(userId, role) => {
    console.log(userId, role)
    try{
        await db.none('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
        return true;
    }catch(error){
        console.log('Error when updating role', error);
        throw error;
    }
}
const getUserStatistics = async () => {
    try {
      const statistics = await db.any('SELECT role, COUNT(*) as count FROM users GROUP BY role');
      return statistics;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  };

  const register = async (userId, courseId) => {
    try {
        await db.none(
            'INSERT INTO registration (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING', [userId, courseId]
        )
    } catch(error) {
        console.error('Error registering user with ID ', userId, "into course with ID", courseId)
    }
}

module.exports = {
    getStudentsByCourseId,
    addStudent,
    addScan,
    getScan,
    getAllUsers,
    changeUserRole,
    getUserStatistics,
    register,
    addUser
}