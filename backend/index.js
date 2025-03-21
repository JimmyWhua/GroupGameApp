// index.js
require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize the OpenAI client configured to use Nillion's nilAI endpoint.
const client = new OpenAI({
  baseURL: 'https://nilai-a779.nillion.network/v1', // Confirm the endpoint from Nillion's docs.
  apiKey: process.env.NILAI_API_KEY,
});

// POST endpoint to generate a prompt
app.post('/generate-prompt', async (req, res) => {
  try {
    console.log('Generating prompt...');
    const response = await client.chat.completions.create({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI prompt generator for a mobile interactive game. Generate creative, fun, and engaging prompts that encourage users to perform actions using their mobile device.  For example, ask them to take a picture of something resembling a cat or to sing a popular song lyric.',
        },
        {
          role: 'user',
          content: 'Generate a prompt challenge for a mobile game.  One line action tasks limited to your apartment.',
        },
      ],
      stream: false,
    });

    // Log the signature for verification (if needed)
    console.log(`Signature: ${response.signature}`);

    // Extract the generated prompt text from the response
    const prompt = response.choices[0].message.content;
    res.json({ prompt, signature: response.signature });
  } catch (error) {
    console.error('Error generating prompt:', error);
    res.status(500).json({ error: 'Failed to generate prompt' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
