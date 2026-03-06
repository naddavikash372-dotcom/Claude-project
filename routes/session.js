const express = require('express');
const { startSession, updateSession } = require('../sessionLogger');

const router = express.Router();

router.post('/start', (req, res) => {
    const { product_searched } = req.body;
    const sessionId = startSession(product_searched);
    res.json({ session_id: sessionId });
});

router.post('/update', (req, res) => {
    const { session_id, ...updates } = req.body;
    if (!session_id) {
        return res.status(400).json({ error: 'session_id is required' });
    }
    updateSession(session_id, updates);
    res.json({ success: true });
});

module.exports = router;
