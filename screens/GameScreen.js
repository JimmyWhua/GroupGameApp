// screens/GameScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function GameScreen({ route }) {
  // Expect prompt tasks to be passed in route.params.prompt as an array.
  const { prompt } = route.params;
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  if (!prompt || prompt.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No tasks available!</Text>
      </View>
    );
  }

  const currentTask = prompt[currentCardIndex];

  const executeTask = () => {
    // Here you can add logic to, for example, open the camera or start audio recording
    Alert.alert('Execute Task', `Performing: ${currentTask.action}`);
  };

  const nextCard = () => {
    if (currentCardIndex < prompt.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      Alert.alert('End', 'No more tasks available!');
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else {
      Alert.alert('Start', 'This is the first task!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentTask.task_name}</Text>
      <Text style={styles.description}>{currentTask.description}</Text>
      <Text style={styles.type}>Type: {currentTask.task_type}</Text>
      <View style={styles.buttonRow}>
        <Button title="Previous Card" onPress={previousCard} />
        <Button title="Execute Task" onPress={executeTask} />
        <Button title="Next Card" onPress={nextCard} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: { fontSize: 24, marginBottom: 10, textAlign: 'center' },
  description: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
  type: { fontSize: 16, marginBottom: 20, fontStyle: 'italic' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '80%' },
  message: { fontSize: 20, textAlign: 'center' },
});
