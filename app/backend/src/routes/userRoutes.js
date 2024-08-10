const express = require('express');
const csv = require('csv-parser');
const stream = require('stream');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { 
    getStudentsByCourseId, 
    addStudent,  
    register, 
    getAllUsers,
    getScan,
    addUser,
    changeUserRole
 } = require('../controllers/userController');

router.post('/register', async (req, res) => {
    const courseId = req.body.courseId;
    const studentId = req.body.studentId;
    try {
        await register(studentId, courseId)
        console.log(`registering ${studentId} in course ${courseId}`);
        res.status(200).json({ message: `student ${studentId} sucessfully registered in ${courseId}`});
    } catch {
        res.status(500).json({ error: `Error registering student ${studentId}` });
    }
});

router.get('/:courseId', async (req, res) => {
    try {
        const studentList = await getStudentsByCourseId(req.params.courseId);
        res.status(200).json(studentList);
    } catch(error) {
        res.status(400).json({error: error.message});
    }
});

router.post('/add', async (req, res) => {
    try {
        const { studentId, firstName, lastName, email, role } = req.body;
        console.log(studentId, firstName, lastName, email, role)
        await addUser(studentId, firstName, lastName, email, role);
        res.status(200).json({message: 'Student was added'});
    } catch(error) {
        res.status(500).json({error: error.message});
    }
})

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);
      // Parse the CSV data from the buffer
      const results = [];
      bufferStream.pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
          console.log('Parsed CSV Data:', results); // This is the parsed CSV data
          results.forEach((student) => {
              console.log("Student",student);
              const id = student.id;
              const first = student.first_name;
              const last = student.last_name;
              const email = student.email;
              const password = student.password || "changeme";
              const courseId = req.headers["courseid"];
              if(id && email) {
                  addStudent(id, first, last, email, password, courseId);
              };
          });
          res.status(200).send('File uploaded and parsed successfully.');
      });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while processing the file.');
    }   
});

router.get('/get/all', async(req, res) =>{
  try{
      const users = await getAllUsers();
      res.status(200).json(users);
  }catch(error){
      console.error('heres the error', error);
      res.status(500).send({error: 'an error occoured while getAllUsers'})
  }
});

router.put('/changerole/:userId', async(req,res) =>{
    const{userId } = req.params;
    const{role} = req.body;
    console.log(role);
    console.log(userId)
    try{
    await changeUserRole(userId, role);
    res.status(200).json({message: 'role updated succesfully'});

    }catch(error){
    res.status(200).json({message: 'an error occoured while changeUserRole'});
    }
  });

router.get('/get/sitestatistics', async (req, res) => {
    try {
      const users = await getAllUsers(); 
      const statistics = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});
      res.status(200).json(statistics);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user statistics' });
    }
  });

router.get('/scans/:examId/:userId', async (req, res) => {
    try {
        const { examId, userId } = req.params
        const path = await getScan(examId, userId);
        console.log(`GETTING SCAN FOR EXAM: ${examId}, USER: ${userId}`);
        console.log(path);
        res.status(200).json({path: path.scan});
    } catch(error) {
        res.status(400).json({error: error.message});
    }
});

router.post('/tests/edit', async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.headers['testid']);
        res.status(200)
    } catch(error) {
        res.status(400).json({error: error.message});
    }
})

module.exports = router;
