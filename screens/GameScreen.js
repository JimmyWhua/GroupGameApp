// screens/GameScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GameScreen({ route }) {
  const { prompt, gameCode } = route.params || {};

  return (
    <View style={styles.container}>
      {prompt ? (
        <Text style={styles.prompt}>Game Prompt: {prompt}</Text>
      ) : gameCode ? (
        <Text style={styles.prompt}>Joined Game Code: {gameCode}</Text>
      ) : (
        <Text style={styles.prompt}>Waiting for game to start...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  prompt: { fontSize: 20, textAlign: 'center', paddingHorizontal: 20 },
});
