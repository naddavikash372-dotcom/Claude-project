const express = require('express');
const { callAnthropic } = require('../anthropic');
const { getCachedGuide, cacheGuide } = require('../cache');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { messages, systemPrompt, maxTokens, productName } = req.body;

        // 1. Check Cache (if productName is provided)
        if (productName) {
            const cached = getCachedGuide(productName);
            if (cached) {
                console.log(`Returning cached guide for: ${productName}`);
                return res.json({ result: cached, from_cache: true });
            }
        }

        // 2. Call Anthropic (now returns raw response)
        const result = await callAnthropic({
            messages,
            systemPrompt,
            maxTokens: maxTokens || 4000
        });

        // 3. Cache Result (if productName is provided, we cache the raw response)
        if (productName && result && result.content) {
            cacheGuide(productName, result);
        }

        // 4. Return result (the raw Anthropic response object)
        res.json({ result });
    } catch (error) {
        console.error('AI Route Error:', error.message);
        res.status(500).json({ error: error.message || 'failed_to_process_ai_request' });
    }
});

module.exports = router;
