async function testChat() {
    try {
        const response = await fetch('https://final-year-project-f2p0.onrender.com/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'hi' }]
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);
    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

testChat();
