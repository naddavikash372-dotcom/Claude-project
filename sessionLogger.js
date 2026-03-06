const db = require('./db');
const { v4: uuidv4 } = require('uuid');

function startSession(productSearched) {
    const sessionId = uuidv4();
    const stmt = db.prepare(`
    INSERT INTO sessions (session_id, product_searched)
    VALUES (?, ?)
  `);
    stmt.run(sessionId, productSearched || '');
    console.log(`New session started: ${sessionId}`);
    return sessionId;
}

function updateSession(sessionId, data) {
    const fields = Object.keys(data);
    if (fields.length === 0) return;

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => data[field]);

    const stmt = db.prepare(`
    UPDATE sessions
    SET ${setClause}
    WHERE session_id = ?
  `);

    stmt.run(...values, sessionId);
    console.log(`Session ${sessionId} updated:`, data);
}

module.exports = {
    startSession,
    updateSession
};
