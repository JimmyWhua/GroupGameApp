// screens/CreateGameScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function CreateGameScreen({ navigation }) {
  const [currentPrompt, setCurrentPrompt] = useState(null);

  const startGame = async () => {
    try {
      // Replace with your laptop's local IP address exposed by `ipconfig getifaddr en0`
      const response = await fetch('http://192.168.1.246:3000/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Optionally, send additional data in the body if needed
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      const prompt = data.prompt;
      setCurrentPrompt(prompt);
      navigation.navigate('Game', { prompt });
    } catch (error) {
      console.error('Error generating prompt:', error);
      Alert.alert('Error', 'Failed to generate a prompt. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Game</Text>
      <Button title="Start Game" onPress={startGame} />
      {currentPrompt && <Text style={styles.prompt}>Current Prompt: {currentPrompt}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  prompt: { marginTop: 20, fontSize: 18, textAlign: 'center' },
});
