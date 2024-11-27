import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { Video } from 'expo-av';
import axios from 'axios';  // Import axios
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';  // Import to handle file paths

export default function HighlightVideoScreen({ route }) {
  const navigation = useNavigation();
  const { studentId } = route.params || {}; // Safeguard in case `params` is missing
  const [video, setVideo] = useState(null);
  const videoRef = useRef(null);

  const pickVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to allow access to your media library to upload a video.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVideo(result.assets[0].uri);
    } else {
      Alert.alert('Error', 'Could not select a video. Please try again.');
    }
  };

  const recordVideo = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to allow access to your camera to record a video.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVideo(result.assets[0].uri);
    } else {
      Alert.alert('Error', 'Could not record a video. Please try again.');
    }
  };

  // Function to resolve file URI if needed
  const getFile = async (uri) => {
    if (Platform.OS !== 'web') {  // Only use expo-file-system for native platforms
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        return fileInfo.uri;
      }
    }
    // For web, just return the uri directly
    return uri;
  };

  const handleNext = async () => {
    if (!video) {
      Alert.alert('No Video Selected', 'Please select a video before proceeding.');
      return;
    }

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const formData = new FormData();

      // Get the raw file URI and file info using FileSystem
      const fileUri = await getFile(video);  // This ensures the URI is resolved correctly
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (!fileInfo.exists) {
        Alert.alert('Error', 'Invalid video file.');
        return;
      }

      // Prepare the file object to be uploaded
      const file = {
        uri: fileUri,
        name: 'highlight_video_1.mp4',  // Ensure a valid filename is provided
        type: 'video/mp4',  // Set MIME type correctly
      };

      formData.append('file', file);

      // Use axios to send the POST request
      const response = await axios.post('http://192.168.1.8:3000/students/upload-video-highlight', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',  // Set content type for file upload
        },
      });

      if (response.data) {
        Alert.alert('Upload Successful', 'Your video has been uploaded successfully!');
        navigation.navigate('ProfileImageScreen');
      } else {
        Alert.alert('Upload Failed', 'Failed to upload video. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert('Error', 'An error occurred while uploading your video. Please try again.');
    }
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Additional Information</Text>
      <Text style={styles.subtitle}>HIGHLIGHT VIDEO</Text>
      <View style={styles.videoPlaceholder}>
        {video ? (
          <Video
            ref={videoRef}
            source={{ uri: video }}
            style={styles.videoPreview}
            useNativeControls
            resizeMode="contain"
            onError={(error) => console.error('Video Error:', error)}
          />
        ) : (
          <Text style={styles.instructions}>No video selected or recorded</Text>
        )}
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={pickVideo} style={styles.pickVideoButton}>
          <Text style={styles.buttonText}>Select Video</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={recordVideo} style={styles.recordVideoButton}>
          <Text style={styles.buttonText}>Record Video</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.instructions}>
        Create a 30 seconds to 1-minute video introduction. Say everything you
        want to capture recruiters' attention. Smile on camera and pretend you
        are talking to a close friend.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
          <Text style={styles.buttonText}>PREVIOUS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff6f00',
    marginBottom: 20,
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    marginBottom: 20,
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  pickVideoButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#ff6f00',
    padding: 15,
    borderRadius: 8,
  },
  recordVideoButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  previousButton: {
    flex: 1,
    marginRight: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  nextButton: {
    flex: 1,
    marginLeft: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6f00',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
