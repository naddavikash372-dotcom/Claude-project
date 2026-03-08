const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const accessGate = require('./middleware/accessGate');
const aiRouter = require('./routes/ai');
const sessionRouter = require('./routes/session');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));


// TOTAL PUBLIC DEBUG ENDPOINT (No password needed)
app.get('/debug', (req, res) => {
    res.json({
        message: "If you see this, the server is updated!",
        time: new Date().toISOString(),
        ACCESS_PASSWORD: process.env.ACCESS_PASSWORD || 'NOT_SET',
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'EXISTS' : 'NOT_SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
        PORT: process.env.PORT || 'NOT_SET',
        env_keys_count: Object.keys(process.env).length
    });
});

// ROUTE TO VIEW DATABASE DATA (No password needed)
app.get('/debug/db', (req, res) => {
    const db = require('./db');
    try {
        const sessions = db.prepare('SELECT * FROM sessions ORDER BY timestamp DESC LIMIT 50').all();
        const cache = db.prepare('SELECT * FROM guides_cache LIMIT 50').all();
        res.json({
            sessions,
            guides_cache: cache
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
