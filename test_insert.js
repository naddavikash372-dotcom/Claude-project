const db = require('./db');
const { v4: uuidv4 } = require('uuid');

function testInsert() {
    const sessionId = uuidv4();
    const stmt = db.prepare(`
    INSERT INTO sessions (session_id, product_searched)
    VALUES (?, ?)
  `);
    stmt.run(sessionId, 'Test Product');
    console.log(`Test session inserted: ${sessionId}`);
}

testInsert();
