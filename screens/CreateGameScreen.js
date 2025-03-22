import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://192.168.1.246:3000';

export default function CreateGameScreen({ navigation }) {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [roomPlayers, setRoomPlayers] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState(null);

  // Log currentPrompt whenever it changes
  useEffect(() => {
    console.log('Current Prompt:', currentPrompt);
  }, [currentPrompt]);

  useEffect(() => {
    // Connect to the Socket.IO server using only the websocket transport
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });
    setSocket(newSocket);

    // Listen for updates on the list of players in the room
    newSocket.on('room-players', (players) => {
      console.log('Updated room players:', players);
      setRoomPlayers(players);
    });

    // Listen for new prompts from the server
    newSocket.on('new-prompt', (result) => {
      console.log('Received new prompt:', result.prompt);

      let promptString = result.prompt;
      let tasksArray = [];

      try {
        if (typeof promptString === 'string') {
          // Trim whitespace
          promptString = promptString.trim();

          // Remove markdown code block markers if present
          if (promptString.startsWith("```json")) {
            promptString = promptString.substring(7).trim(); // remove "```json"
          }
          if (promptString.endsWith("```")) {
            promptString = promptString.substring(0, promptString.length - 3).trim(); // remove ending "```"
          }

          // Check that it starts with '[' or '{'
          if (promptString.startsWith('[') || promptString.startsWith('{')) {
            const parsed = JSON.parse(promptString);
            // If parsed JSON has a "tasks" property, use it; otherwise assume it's directly the array.
            if (Array.isArray(parsed.tasks)) {
              tasksArray = parsed.tasks;
            } else if (Array.isArray(parsed)) {
              tasksArray = parsed;
            } else {
              console.error("Parsed JSON is not in expected format:", parsed);
              return;
            }
          } else {
            console.error("The prompt string does not appear to be valid JSON:", promptString);
            return;
          }
        } else if (typeof result.prompt === 'object') {
          // Already an object: extract tasks array if available.
          if (Array.isArray(result.prompt.tasks)) {
            tasksArray = result.prompt.tasks;
          } else if (Array.isArray(result.prompt)) {
            tasksArray = result.prompt;
          } else {
            console.error("Prompt object is not in expected format:", result.prompt);
            return;
          }
        }
      } catch (err) {
        console.error("Error parsing prompt JSON:", err);
        return;
      }

      console.log('Tasks array:', tasksArray);
      setCurrentPrompt(tasksArray);
      navigation.navigate('Game', { prompt: tasksArray, roomPlayers });
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection Error:', err);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [navigation]);

  const joinRoom = () => {
    if (!socket || !room || !playerName) {
      Alert.alert('Error', 'Please enter a room code and your name.');
      return;
    }
    // Emit join-room event with room code and player's name
    socket.emit('join-room', { room, playerName });
    Alert.alert('Success', `Joined room: ${room}`);
  };

  const generatePrompt = () => {
    if (!socket || !room) {
      Alert.alert('Error', 'You must join a room first.');
      return;
    }
    // Ask the backend to generate a new prompt for this room
    socket.emit('generate-prompt', { room });
  };

  const renderPlayerItem = ({ item }) => (
    <Text style={styles.playerItem}>{item.playerName}</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multiplayer Game</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Room Code"
        value={room}
        onChangeText={setRoom}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Your Name"
        value={playerName}
        onChangeText={setPlayerName}
      />
      <Button title="Join Room" onPress={joinRoom} />

      <FlatList
        data={roomPlayers}
        keyExtractor={(item) => item.id}
        renderItem={renderPlayerItem}
        ListHeaderComponent={<Text style={styles.header}>Players in Room:</Text>}
        style={styles.playerList}
      />

      <Button title="Generate Prompt (Host)" onPress={generatePrompt} />

      {currentPrompt && (
        <View style={styles.promptContainer}>
          <Text style={styles.promptTitle}>Current Prompt:</Text>
          {currentPrompt.map((task) => (
            <View key={task.task_id} style={styles.taskItem}>
              <Text style={styles.taskName}>{task.task_name}</Text>
              <Text style={styles.taskDescription}>{task.description}</Text>
              <Text style={styles.taskAction}>{task.action}</Text>
              <Text style={styles.taskType}>Type: {task.task_type}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  header: { fontSize: 18, marginVertical: 10 },
  playerItem: { fontSize: 16, padding: 5 },
  playerList: { maxHeight: 150 },
  // New styles for prompt display
  promptContainer: { marginTop: 20 },
  promptTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  taskItem: { padding: 10, borderWidth: 1, borderColor: 'gray', marginBottom: 5 },
  taskName: { fontSize: 18 },
  taskDescription: { fontSize: 16 },
  taskAction: { fontSize: 16, color: 'blue' },
  taskType: { fontSize: 16, fontStyle: 'italic' },
});
