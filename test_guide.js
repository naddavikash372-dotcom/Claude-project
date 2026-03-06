async function testGuideRequest() {
    const productName = "IKEA Billy Bookcase";

    console.log(`--- Testing Guide Generation for: ${productName} ---`);
    try {
        const response = await fetch('http://localhost:3000/api/claude', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password: '123456',
                productName: productName,
                messages: [
                    { role: 'user', content: `Please generate a guide for the ${productName} in JSON format.` }
                ],
                systemPrompt: "You are a helpful assembly guide assistant. Provide a detailed guide for the following product."
            })
        });

        const data = await response.json();
        console.log('Server Status:', response.status);
        if (data.result) {
            console.log('Guide generated successfully and should be cached!');
        } else {
            console.log('Error:', data.error);
        }
    } catch (e) {
        console.error('Connection Error:', e.message);
    }
}

testGuideRequest();
