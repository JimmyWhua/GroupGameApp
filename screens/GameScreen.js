// screens/CreateGameScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://YOUR_COMPUTER_IP:3000'; // Replace with your actual IP

export default function CreateGameScreen({ navigation }) {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [roomPlayers, setRoomPlayers] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState(null);

  useEffect(() => {
    // Connect to the Socket.IO server
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Listen for updates on the list of players in the room
    newSocket.on('room-players', (players) => {
      console.log('Received updated room players:', players);
      setRoomPlayers(players);
    });

    // Listen for new prompts from the server
    newSocket.on('new-prompt', (result) => {
      console.log('Received new prompt:', result.prompt);
      let tasksArray = [];
      try {
        if (typeof result.prompt === 'string') {
          const trimmed = result.prompt.trim();
          if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            const parsed = JSON.parse(trimmed);
            tasksArray = Array.isArray(parsed) ? parsed : parsed.tasks;
          } else {
            console.error("Prompt string does not look like JSON:", trimmed);
            return;
          }
        } else if (typeof result.prompt === 'object') {
          tasksArray = Array.isArray(result.prompt) ? result.prompt : result.prompt.tasks;
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
    if (!socket) {
      Alert.alert('Error', 'Socket not connected yet.');
      return;
    }
    if (!room || !playerName) {
      Alert.alert('Error', 'Please enter both a room code and your name.');
      return;
    }
    console.log(`Emitting join-room with room: ${room} and playerName: ${playerName}`);
    socket.emit('join-room', { room, playerName });
    Alert.alert('Success', `Joined room: ${room}`);
  };

  const generatePrompt = () => {
    if (!socket) {
      Alert.alert('Error', 'Socket not connected yet.');
      return;
    }
    if (!room) {
      Alert.alert('Error', 'You must join a room first.');
      return;
    }
    console.log('Emitting generate-prompt for room:', room);
    socket.emit('generate-prompt', { room });
  };

  // Instead of rendering the raw prompt object,
  // you might render a summary or simply not render it here.
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
        renderItem={({ item }) => <Text style={styles.playerItem}>{item.playerName}</Text>}
        ListHeaderComponent={<Text style={styles.header}>Players in Room:</Text>}
        style={styles.playerList}
      />

      <Button title="Generate Prompt (Host)" onPress={generatePrompt} />

      {/* For debugging purposes, you can stringify the current prompt */}
      {currentPrompt && (
        <Text style={styles.debugPrompt}>
          {JSON.stringify(currentPrompt, null, 2)}
        </Text>
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
  debugPrompt: {
    marginTop: 20,
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
