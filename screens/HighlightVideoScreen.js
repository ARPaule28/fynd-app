import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HighlightVideoScreen({ navigation, route }) {
  const { studentId } = route.params; // Assuming studentId is passed through navigation params
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  // Function to handle video selection
  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your camera roll to upload videos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
      durationLimit: 60, // Set video duration limit to 1 minute
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      generateThumbnail(result.assets[0].uri);
    }
  };

  // Function to record a video
  const recordVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your camera to record a video.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
      durationLimit: 60, // 1-minute limit
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      generateThumbnail(result.assets[0].uri);
    }
  };

  // Generate a thumbnail for the video
  const generateThumbnail = async (uri) => {
    try {
      const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(uri, {
        time: 5000,
      });
      setThumbnail(thumbUri);
    } catch (e) {
      console.warn(e);
    }
  };

  // Function to upload the video
const uploadVideo = async () => {
    if (!video) {
      Alert.alert('No Video Selected', 'Please select or record a video first.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', {
      uri: video,
      name: `highlight_${studentId}.mp4`,
      type: 'video/mp4',
    });
  
    // Get the token from AsyncStorage
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      Alert.alert('Unauthorized', 'Please log in again.');
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:3000/students/upload-video-highlight`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data) {
        Alert.alert('Upload Successful', 'Your highlight video has been uploaded.');
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Failed', 'There was an error uploading your video.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Highlight Video</Text>
      <Text style={styles.subText}>
        Create a 30-second to 1-minute video introduction. Say everything you wanted to say to capture the attention of recruiters. 
        Remember to smile on the camera and pretend you are talking to a close friend.
      </Text>

      {thumbnail && (
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      )}

      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Text style={styles.buttonText}>Upload Video</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={recordVideo}>
        <Text style={styles.buttonText}>Record Video</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={uploadVideo}>
        <Text style={styles.submitButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
  },
  thumbnail: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
