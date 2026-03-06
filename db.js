const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new DatabaseSync(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    product_searched TEXT,
    identify_accepted BOOLEAN DEFAULT 0,
    refinement_attempts INTEGER DEFAULT 0,
    steps_total INTEGER DEFAULT 0,
    stuck_triggered BOOLEAN DEFAULT 0,
    stuck_step INTEGER,
    stuck_input TEXT,
    guide_completed BOOLEAN DEFAULT 0,
    abandoned_at_step INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS guides_cache (
    normalized_name TEXT PRIMARY KEY,
    product_name TEXT,
    guide_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Database initialized successfully.');

module.exports = db;
