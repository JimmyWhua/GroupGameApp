require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Create an HTTP server and attach Socket.IO to it
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' } // In production, restrict origins as needed
});

// Initialize the OpenAI client configured to use Nillion's nilAI endpoint.
const client = new OpenAI({
  baseURL: 'https://nilai-a779.nillion.network/v1', // Confirm with Nillion's docs
  apiKey: process.env.NILAI_API_KEY,
});

// Object to track players in each room
// Example structure: { roomCode: [{ id: socketId, playerName: 'Alice' }, ...] }
const rooms = {};

// Helper function to generate a prompt using nilAI
async function generatePrompt() {
  const response = await client.chat.completions.create({
    model: 'meta-llama/Llama-3.1-8B-Instruct',
    messages: [
      {
        role: 'system',
        content:
          'You are an AI prompt generator for a mobile interactive game. Generate creative, fun, and engaging prompts that encourage users to perform actions using their mobile device. For example, ask them to take a picture of something resembling a cat or to sing a popular song lyric.',
      },
      {
        role: 'user',
        content:
        'Generate a prompt challenge for a mobile game. Create 10 tasks limited to your apartment. Limit the tasks to taking pictures and singing. Return the result as a valid JSON array with no additional text. Each task should be a JSON object with the following keys: "task_id" (number), "task_name" (string), "description" (string), "action" (string), and "task_type" (string, either "picture" or "singing").',
      },
    ],
    stream: false,
  });

  // Return the prompt and signature for verification if needed
  return {
    prompt: response.choices[0].message.content,
    signature: response.signature,
  };
}

// REST endpoint to generate a prompt
app.post('/generate-prompt', async (req, res) => {
  try {
    console.log('Generating prompt via REST endpoint...');
    const result = await generatePrompt();
    console.log(`Signature: ${result.signature}`);
    res.json(result);
  } catch (error) {
    console.error('Error generating prompt:', error);
    res.status(500).json({ error: 'Failed to generate prompt' });
  }
});

// Socket.IO connection handling for real-time multiplayer features
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Listen for a join-room event; clients send a room and playerName.
  socket.on('join-room', ({ room, playerName }) => {
    socket.join(room);
    // Store room and playerName on the socket for later reference
    socket.room = room;
    socket.playerName = playerName;

    // Initialize room if it doesn't exist
    if (!rooms[room]) {
      rooms[room] = [];
    }
    // Add player to the room list
    rooms[room].push({ id: socket.id, playerName });
    console.log(`${playerName} joined room: ${room}`);

    // Broadcast the updated list of players to everyone in the room
    io.to(room).emit('room-players', rooms[room]);
    // Optionally, notify others that a new player has joined
    socket.to(room).emit('player-joined', { playerName, id: socket.id });
  });

  // Listen for a generate-prompt event from a client (host or player)
  socket.on('generate-prompt', async ({ room }) => {
    try {
      console.log(`Socket ${socket.id} requested prompt for room: ${room}`);
      const result = await generatePrompt();
      // Broadcast the generated prompt to all clients in the room.
      io.to(room).emit('new-prompt', result);
    } catch (error) {
      console.error('Socket error generating prompt:', error);
      socket.emit('error', { message: 'Failed to generate prompt' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Remove the disconnected player from their room list (if available)
    if (socket.room && rooms[socket.room]) {
      rooms[socket.room] = rooms[socket.room].filter(
        (player) => player.id !== socket.id
      );
      // Broadcast the updated list to the room
      io.to(socket.room).emit('room-players', rooms[socket.room]);
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
