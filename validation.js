/**
 * Extracts and validates JSON from a string response.
 */

function extractJSON(text) {
    try {
        // Remove markdown code blocks if present
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const start = cleanText.indexOf('{');
        const end = cleanText.lastIndexOf('}');

        if (start === -1) return null;

        let jsonStr;
        if (end === -1 || end < start) {
            // Potentially truncated JSON
            jsonStr = cleanText.slice(start);
            // Try to close it if it's obviously a list of steps that got cut
            if (jsonStr.includes('"steps": [')) {
                // Heuristic: if it ends mid-object, try to close the object, then the array, then the root object
                jsonStr = jsonStr.trim();
                if (!jsonStr.endsWith('}')) jsonStr += ' }';
                if (!jsonStr.endsWith(']')) jsonStr += ' ]';
                if (!jsonStr.endsWith('}')) jsonStr += ' }';
            }
        } else {
            jsonStr = cleanText.slice(start, end + 1);
        }

        return JSON.parse(jsonStr);
    } catch (e) {
        console.error('Error parsing JSON from response:', e.message);
        // last ditch effort: if it failed, maybe it's still slightly broken
        return null;
    }
}

function validateGuide(data) {
    if (!data || typeof data !== 'object') return false;

    const requiredFields = ['product_name', 'description', 'pain_point', 'steps', 'completion_message'];
    for (const field of requiredFields) {
        if (!(field in data)) {
            console.warn(`Missing required field: ${field}`);
            return false;
        }
    }

    // Validate pain_point
    const pp = data.pain_point;
    if (!pp || typeof pp !== 'object') return false;
    const ppFields = ['title', 'description', 'step_number', 'reminder'];
    for (const field of ppFields) {
        if (!(field in pp)) {
            console.warn(`Missing pain_point field: ${field}`);
            return false;
        }
    }

    // Validate steps
    if (!Array.isArray(data.steps)) {
        console.warn('Steps field is not an array');
        return false;
    }

    return true;
}

module.exports = {
    extractJSON,
    validateGuide
};
