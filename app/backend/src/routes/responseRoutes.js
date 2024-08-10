const express = require('express');
const router = express.Router();
const {
    addResponse,
    deleteResponses
} = require('../controllers/responseController');

router.delete('/delete', async (req, res) => {
    const userId = req.body.userId;
    const examId = req.body.examId;
    try {
        await deleteResponses(userId, examId);
        res.status(200).json({message: `responses successfully deleted for student: ${userId} on exam: ${examId}`})
    } catch(error) {
        console.error(error)
        res.status(500);
    }
});

router.put('/edit', async (req, res) =>  {
    const examId = req.body.exam_id;
    const userId = req.body.student_id;
    const modifiedResponses = req.body.modifiedResponses;
    const upDateResponses = async () => {
        for(let i = 0; i < modifiedResponses.length; i++) {
            await addResponse(examId, modifiedResponses[i].questionNum, userId, modifiedResponses[i].responseArray, true);
        }
    }
    await upDateResponses();
    res.status(200).json({message: `responses successfully saved for student: ${userId} on exam: ${examId}`})
  });

  module.exports = router;