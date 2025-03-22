import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const executeTask = async (task) => {
  if (task.task_type === 'picture') {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    console.log('Camera Permission Status:', status); // Debug

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permissions are required to take a picture.');
      return null; // Return null to indicate failure
    }

    // Launch the camera
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1, // Highest quality
      base64: true, // Include base64-encoded image data
    });

    if (!result.canceled) { // Changed from .cancelled to .canceled (Expo convention)
      const imageUri = result.uri;
      const imageBase64 = result.base64; // Base64 string of the image
      Alert.alert('Photo Taken', `Image URI: ${imageUri}`);

      // Send the image to the Rust/SP1 backend
      try {
        const response = await fetch('http://your-backend-address:port/detect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: imageBase64, // Send base64-encoded image
            task_prompt: task.action, // Include the task prompt (e.g., "dog")
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        Alert.alert(
          'Backend Response',
          `Detection Result: ${data.result}\nProof: ${data.proof ? 'Generated' : 'Not Generated'}`
        );

        // Return the result and proof for further use if needed
        return {
          imageUri,
          detectionResult: data.result,
          proof: data.proof,
        };
      } catch (error) {
        Alert.alert('Error', `Failed to send image to backend: ${error.message}`);
        return null;
      }
    } else {
      Alert.alert('Cancelled', 'Photo capture was cancelled.');
      return null;
    }
  } else {
    Alert.alert('Execute Task', `Performing: ${task.action}`);
    return null;
  }
};