// screens/CreateGameScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://192.168.1.246:3000'; // Replace with your actual IP

export default function CreateGameScreen({ navigation }) {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [roomPlayers, setRoomPlayers] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState(null);

  useEffect(() => {
    // Connect to the Socket.IO server using only websocket transport
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });
    setSocket(newSocket);

    // Listen for updated list of players
    newSocket.on('room-players', (players) => {
      console.log('Updated room players:', players);
      setRoomPlayers(players);
    });

    // Listen for new prompt from the server
    newSocket.on('new-prompt', (result) => {
      console.log('Received new prompt:', result.prompt);
      let tasksArray = [];

      try {
        if (typeof result.prompt === 'string') {
          const trimmed = result.prompt.trim();
          // Check that it starts with '[' or '{'
          if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            const parsed = JSON.parse(trimmed);
            tasksArray = Array.isArray(parsed) ? parsed : parsed.tasks;
          } else {
            console.error("Prompt string does not look like JSON:", trimmed);
            return;
          }
        } else if (typeof result.prompt === 'object') {
          tasksArray = Array.isArray(result.prompt)
            ? result.prompt
            : result.prompt.tasks;
        }
      } catch (err) {
        console.error("Error parsing prompt JSON:", err);
        return;
      }

      console.log('Tasks array:', tasksArray);
      setCurrentPrompt(tasksArray);
      // Navigate to the game screen with prompt tasks and room players info.
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
    console.log(`Joining room ${room} as ${playerName}`);
    socket.emit('join-room', { room, playerName });
    Alert.alert('Success', `Joined room: ${room}`);
  };

  const generatePrompt = () => {
    if (!socket || !room) {
      Alert.alert('Error', 'You must join a room first.');
      return;
    }
    console.log('Generating prompt for room:', room);
    socket.emit('generate-prompt', { room });
  };

  const renderPlayerItem = ({ item }) => (
    <Text style={styles.playerItem}>{item.playerName}</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multiplayer Game Setup</Text>
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

      {/* For debugging, you might show the raw prompt JSON */}
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
