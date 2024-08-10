const express = require('express');
const router = express.Router();
const {
    flagResponse,
    flagExam,
    resolveFlag,
    getFlagged,
} = require('../controllers/flagController');

router.get('/get/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        const flags = await getFlagged(userId);
        res.status(200).json(flags);
    } catch(error) {
        res.status(500).json({error: error.message})
    }
});

router.post('/resolve', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Flag ID is required' });
        }

        await resolveFlag(id);

        res.status(200).json({ message: `Flagged response with ID ${id} has been resolved` });
    } catch (error) {
        console.error('Error resolving flag:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post('/set', async (req, res) => {
    try {
        const { examId, userId, questionNum, flagText } = req.body;
        await flagResponse(examId, userId, questionNum, flagText);
        res.status(200).json({message: 'Added issue for question',questionNum})
    } catch(error) {
        res.status(500).json({error: error.message})
    }
});

module.exports = router;