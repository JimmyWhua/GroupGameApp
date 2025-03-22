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
    // Add logic here to execute the task (e.g., open camera for picture tasks)
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
      <View style={styles.cardContainer}>
        <Text style={styles.title}>{currentTask.task_name}</Text>
        <Text style={styles.description}>{currentTask.description}</Text>
        <Text style={styles.type}>Type: {currentTask.task_type}</Text>
      </View>
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
    backgroundColor: '#f7f7f7',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333'
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#666'
  },
  type: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#999'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
    color: '#555'
  }
});
