import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import axios from 'axios';

const AccountSettingsScreen = () => {
  const navigation = useNavigation();
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [videoUri, setVideoUri] = useState(null);
  const [editableEmail, setEditableEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const studentId = await AsyncStorage.getItem('studentId');

        if (!accessToken || !studentId) {
          console.error('AccessToken or StudentId is missing!');
          return;
        }

        const currentStudentResponse = await axios.get(
          `http://192.168.1.8:3000/students/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const studentData = currentStudentResponse.data;
        setCurrentStudent(studentData);
        setEditableEmail(studentData.email || '');

        if (studentData.profile_image) {
          setProfileImageUri(studentData.profile_image);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigation.navigate('Login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  const handleProfileImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.cancelled) {
      setProfileImageUri(result.uri);
      Alert.alert('Profile picture updated successfully!');
    }
  };

  const handleReelVideoUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
    });

    if (result.type === 'success') {
      setVideoUri(result.uri);
      console.log('Video URI:', result.uri); // Debugging: Ensure the video URI is set
      Alert.alert('Video uploaded successfully!');
    }
  };

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }
    Alert.alert('Success', 'Password updated successfully!');
  };

  const handleEmailUpdate = () => {
    if (!editableEmail) {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }
    Alert.alert('Success', 'Email updated successfully!');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Account Settings</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.label}>Profile Picture</Text>
          <Image
            source={{ uri: profileImageUri || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.updateButton} onPress={handleProfileImageUpload}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={editableEmail}
            onChangeText={setEditableEmail}
          />
          <TouchableOpacity style={styles.updateButton} onPress={handleEmailUpdate}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={styles.updateButton} onPress={handlePasswordUpdate}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
            <Text style={styles.label}>Reel Video</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={handleReelVideoUpload}>
                <Text style={styles.uploadText}>
                {videoUri ? 'Video Selected' : 'Upload a File (MP4)'}
                </Text>
            </TouchableOpacity>
            {videoUri && (
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: '#007BFF', fontWeight: 'bold' }}>Selected Video:</Text>
                <Text style={{ color: '#555' }}>{videoUri.split('/').pop()}</Text>
                <TouchableOpacity style={styles.updateButton} onPress={handleReelVideoUpload}>
                    <Text style={styles.updateButtonText}>Update Video</Text>
                </TouchableOpacity>
                </View>
            )}
            </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  title: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  uploadBox: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    padding: 10,
    width: '100%',
  },
  uploadText: {
    color: '#999',
  },
});

export default AccountSettingsScreen;
