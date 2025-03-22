import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const testRustServer = async () => {
  try {
    const response = await fetch('http://192.168.1.246:3001/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    Alert.alert('Error', `Failed to process image: ${error.message}`);
    return null;
  }
};

const sendPhotoToSP1 = async (base64Image, taskPrompt) => {
  try {
    const response = await fetch('http://192.168.1.246:3001/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        task_prompt: taskPrompt, // e.g., task.action
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    Alert.alert('Error', `Failed to process image: ${error.message}`);
    return null;
  }
};


export const executeTask = async (task) => {
  // await testRustServer();
  if (task.task_type === 'picture') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    console.log('Camera Permission Status:', status);
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permissions are required to take a picture.');
      return null;
    }

    let result = await ImagePicker.launchCameraAsync({
      base64: true,
    }
    );
    console.log('**************');
    console.log('Result Object:', result); // Log the entire result object
    // console.log('Result Keys:', Object.keys(result)); // Log the keys of the result rtobject
    console.log('Canceled:', result.canceled); // Log the canceled property
    console.log('**************');
    console.log('Result Keys:', Object.keys(result.assets['0'].base64)); // Log the keys of the result object
    console.log('**************');




    if (!result.canceled) {
      console.log('in here')
      const imageUri = result.assets['0'].uri;
      Alert.alert('Photo Taken', `Image URI: ${imageUri}`);
      // console.log()
      const imageBase64 = result.assets['0'].base64; // Extract the base64 image data
      console.log(task.action)

      // Send the image to your SP1 endpoint for processing
      const sp1Result = await sendPhotoToSP1(imageBase64, task.action);
      if (sp1Result) {
        Alert.alert(
          'Backend Response',
          `Detection Result: ${sp1Result.result}\nProof: ${sp1Result.proof ? 'Generated' : 'Not Generated'}`
        );
        return {
          imageUri: result.uri,
          detectionResult: sp1Result.result,
          proof: sp1Result.proof,
        };
      } else {
        Alert.alert('Cancelled', 'Photo capture was not sent to sp1.');
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
