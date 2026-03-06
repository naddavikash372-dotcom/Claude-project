async function testRequest() {
    console.log('--- Test Request Without Password ---');
    try {
        const res1 = await fetch('http://localhost:3000/api/session/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_searched: 'TestFail' })
        });
        const data1 = await res1.json();
        console.log('Response (expected 401):', res1.status, data1);
    } catch (e) {
        console.error('Error 1:', e.message);
    }

    console.log('\n--- Test Request With Password ---');
    try {
        const res2 = await fetch('http://localhost:3000/api/session/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_searched: 'TestSuccess',
                password: '123456'
            })
        });
        const data2 = await res2.json();
        console.log('Response (expected 200):', res2.status, data2);
    } catch (e) {
        console.error('Error 2:', e.message);
    }
}

testRequest();
