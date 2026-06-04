import OpenAI from 'openai';
import asyncHandler from 'express-async-handler';

// We will initialize openai dynamically inside the request handler.
let openai;

// @desc    Process chat messages
// @route   POST /api/chat
// @access  Public
export const handleChat = asyncHandler(async (req, res) => {
    const { messages } = req.body;

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
            success: false, 
            message: 'OpenAI API key is not configured on the server. Please add it to the backend/.env file.' 
        });
    }

    if (!openai) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    if (!messages || !Array.isArray(messages)) {
        res.status(400);
        throw new Error('Messages array is required');
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant for a blood donation and thalassemia platform. You are polite, concise, and helpful." },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        res.json({
            success: true,
            reply: response.choices[0].message
        });
    } catch (error) {
        console.error('OpenAI Error:', error);
        res.status(500);
        throw new Error(error.message || 'Failed to communicate with AI');
    }
});
