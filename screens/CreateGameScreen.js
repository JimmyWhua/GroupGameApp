// screens/CreateGameScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const cardPrompts = [
  'Prompt 1: Your first challenge!',
  'Prompt 2: Do something creative!',
  'Prompt 3: Time for a fun fact!',
  'Prompt 4: Tell a joke!',
];

export default function CreateGameScreen({ navigation }) {
  const [currentPrompt, setCurrentPrompt] = useState(null);

  const startGame = () => {
    // Randomly select a prompt from the list
    const randomIndex = Math.floor(Math.random() * cardPrompts.length);
    setCurrentPrompt(cardPrompts[randomIndex]);
    // You could also navigate to a GameScreen and pass the prompt as a parameter
    navigation.navigate('Game', { prompt: cardPrompts[randomIndex] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Game</Text>
      <Button title="Start Game" onPress={startGame} />
      {currentPrompt && (
        <Text style={styles.prompt}>Current Prompt: {currentPrompt}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  prompt: { marginTop: 20, fontSize: 18, textAlign: 'center' },
});
