const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const accessGate = require('./middleware/accessGate');
const aiRouter = require('./routes/ai');
const sessionRouter = require('./routes/session');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Apply access gate to all /api routes
app.use('/api', accessGate);

// Public/Semi-public endpoints (already handled within accessGate checks)
app.post('/api/auth', (req, res) => {
    const { password } = req.body;
    const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD;
    if (!password || password !== ACCESS_PASSWORD) {
        return res.status(401).json({ success: false, error: 'invalid_password' });
    }
    res.json({ success: true });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/claude', aiRouter);
app.use('/api/session', sessionRouter);

// Basic error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'server_failure' });
});

app.listen(port, () => {
    console.log(`Quiet Toolbox Backend running at http://localhost:${port}`);
});
