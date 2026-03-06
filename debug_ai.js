const dotenv = require('dotenv');
dotenv.config();
const { callAnthropic } = require('./anthropic');

async function debugAI() {
    console.log('--- Debugging AI Response ---');
    try {
        const result = await callAnthropic({
            messages: [{ role: 'user', content: 'Generate a guide for IKEA Billy Bookcase' }],
            systemPrompt: 'You are a helpful assembly guide assistant.',
            shouldValidate: true
        });
        console.log('SUCCESS:', JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('FAILED:', e.message);
    }
}

debugAI();
