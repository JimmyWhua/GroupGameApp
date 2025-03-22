import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useLoginWithEmail } from '@privy-io/expo';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  // Destructure sendCode and loginWithCode functions from the hook
  const { sendCode, loginWithCode } = useLoginWithEmail();

  const handleSendCode = async () => {
    try {
      await sendCode(email);
      Alert.alert('Code Sent', `A login code was sent to ${email}`);
    } catch (error) {
      console.error('sendCode error:', error);
      Alert.alert('Error', 'Failed to send code');
    }
  };

  const handleLoginWithCode = async () => {
    try {
      const user = await loginWithCode(email, code);
      Alert.alert('Login Successful', `Welcome, ${user.email}`);
      // You can navigate to the next screen or update state here.
    } catch (error) {
      console.error('loginWithCode error:', error);
      Alert.alert('Error', 'Failed to log in');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Email</Text>
      <TextInput 
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button title="Send Code" onPress={handleSendCode} />

      <TextInput 
        style={styles.input}
        placeholder="Enter the code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
      />
      <Button title="Login" onPress={handleLoginWithCode} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600'
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  }
});
