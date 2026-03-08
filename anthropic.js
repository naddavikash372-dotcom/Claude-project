const Prompts = require('./prompts');

async function callAnthropic({ messages, systemPrompt, systemPromptKey, context, maxTokens = 4000 }) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        console.error('CRITICAL: ANTHROPIC_API_KEY is missing in process.env');
        throw new Error('ANTHROPIC_API_KEY is not set.');
    }

    // Use the key if provided, otherwise fallback to raw prompt
    let finalSystemPrompt = systemPromptKey ? Prompts[systemPromptKey] : systemPrompt;

    // Append context if provided
    if (context) {
        finalSystemPrompt = (finalSystemPrompt || '') + `\n\nContext: ${context}`;
    }

    console.log(`Calling Anthropic with model: claude-3-5-sonnet-20241022`);
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
            'x-api-key': apiKey
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-5',
            max_tokens: maxTokens,
            system: finalSystemPrompt,
            messages
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Anthropic error: ${errorData.error.message}`);
    }

    const data = await response.json();
    console.log('Anthropic raw response:', JSON.stringify(data, null, 2));

    return data;
}

module.exports = { callAnthropic };
