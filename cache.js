const db = require('./db');

function normalizeProductName(name) {
    if (!name) return '';
    return name.toLowerCase().trim().replace(/\s+/g, ' ');
}

function getCachedGuide(productName) {
    const normalized = normalizeProductName(productName);
    const row = db.prepare('SELECT guide_json FROM guides_cache WHERE normalized_name = ?').get(normalized);
    if (row) {
        console.log(`Cache hit for: ${normalized}`);
        return JSON.parse(row.guide_json);
    }
    return null;
}

function cacheGuide(productName, guideData) {
    const normalized = normalizeProductName(productName);
    const jsonStr = JSON.stringify(guideData);

    db.prepare(`
    INSERT OR REPLACE INTO guides_cache (normalized_name, product_name, guide_json)
    VALUES (?, ?, ?)
  `).run(normalized, productName, jsonStr);

    console.log(`Guide cached for: ${normalized}`);
}

module.exports = {
    getCachedGuide,
    cacheGuide,
    normalizeProductName
};
