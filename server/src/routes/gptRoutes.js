const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        const systemMessage = {
            role: "system",
            content: "You are MSIT GPT, the official and highly intelligent AI companion for the students of MSIT (Meghnad Saha Institute of Technology). You must speak in a highly engaging, friendly, and deeply human-like tone—use expressive language, emojis where appropriate, and a conversational flow. Structure your responses beautifully:ALWAYS use **bold headings** to organize your thoughts, keep paragraphs short, and avoid walls of text. You help students debug code, understand engineering concepts, and solve coursework problems efficiently. Make them feel supported."
        };

        const apiMessages = [systemMessage, ...messages];

        // Using native fetch which is available in Node 18+
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant', // Upgraded to Llama 3.1
                messages: apiMessages,
                temperature: 0.7,
                max_tokens: 2048,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API Error:', errorText);
            return res.status(response.status).json({ error: 'Failed to communicate with AI provider' });
        }

        const data = await response.json();

        res.json({
            reply: data.choices[0].message.content
        });

    } catch (error) {
        console.error('GPT Route Error:', error);
        res.status(500).json({ error: 'Internal server error while processing AI request' });
    }
});

module.exports = router;
