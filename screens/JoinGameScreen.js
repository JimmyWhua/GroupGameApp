// screens/JoinGameScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function JoinGameScreen({ navigation }) {
  const [gameCode, setGameCode] = useState('');

  const joinGame = () => {
    // Validate the game code or use it to join a game
    // For now, simply navigate to the Game screen and pass the game code
    navigation.navigate('Game', { gameCode });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Game</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Game Code"
        value={gameCode}
        onChangeText={setGameCode}
      />
      <Button title="Join" onPress={joinGame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  input: { 
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    width: '80%', 
    paddingHorizontal: 10, 
    marginBottom: 20 
  },
});
