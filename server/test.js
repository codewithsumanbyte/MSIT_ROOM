const dotenv = require('dotenv');
dotenv.config();

async function test() {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [{ role: 'user', content: 'hello' }]
            })
        });
        const data = await response.json();
        console.log(data);
    } catch (e) {
        console.error(e);
    }
}
test();
