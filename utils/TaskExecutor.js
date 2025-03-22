import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const executeTask = async (task) => {
  console.log('*********', task.task_type);
  if (task.task_type === 'picture') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    console.log('Camera Permission Status:', status);
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permissions are required to take a picture.');
      return null;
    }
    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });
    
    if (!result.canceled) {
      const imageUri = result.uri;
      Alert.alert('Photo Taken', `Image URI: ${imageUri}`);
      // You can process or send the base64 data (result.base64) to your backend here.
      return { imageUri, base64: result.base64 };
    } else {
      Alert.alert('Cancelled', 'Photo capture was cancelled.');
      return null;
    }
  } else {

    Alert.alert('Execute Task', `Performing: ${task.action}`);
    return null;
  }
};
