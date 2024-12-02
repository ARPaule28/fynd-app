import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Video } from 'expo-av'; // Importing Video component from expo-av
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, StatusBar } from 'react-native';

const ReadMorePage = ({ route }) => {
  const { studentId } = route.params; // Get the selected student's ID from route params
  const navigation = useNavigation();

  const [student, setStudent] = useState(null); // State to store student data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [paused, setPaused] = useState(true); // Video playback state
  const [isFullscreen, setIsFullscreen] = useState(false); // Fullscreen state

  // Fetch student data using studentId
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken'); // Get access token from AsyncStorage
        if (!accessToken) {
          navigation.navigate('Login'); // Redirect to login if no access token
          return;
        }

        const response = await axios.get(`http://192.168.1.8:3000/students/${studentId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setStudent(response.data); // Set the fetched student data
      } catch (error) {
        console.error('Error fetching student data:', error);
        // Handle error (e.g., navigation to login if authentication fails)
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchStudentData();
  }, [studentId, navigation]);

  // Function to toggle play/pause
  const togglePlayPause = () => {
    setPaused(!paused);
  };

  // Function to toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.container}>
        <Text>No student data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header with Back Button and Student Name */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerName}>{student.username}</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image source={{ uri: student.profile_image }} style={styles.profileImage} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.name}>{student.name}</Text>
            <Text style={styles.title}>{student.careers}</Text>
            <Text style={styles.location}>{student.address}</Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Skills: <Text style={styles.infoValue}>{student.skills}</Text></Text>
          <Text style={styles.infoLabel}>Nationality: <Text style={styles.infoValue}>{student.race}</Text></Text>
          <Text style={styles.infoLabel}>Address: <Text style={styles.infoValue}>{student.address}</Text></Text>
        </View>

        {/* Video Section */}
        <View style={styles.videoPlaceholder}>
          {student.video_highlight ? (
            <TouchableOpacity onPress={togglePlayPause} style={styles.videoContainer}>
              <Video
                source={{ uri: student.video_highlight }}   // Replace with video URL
                style={isFullscreen ? styles.fullscreenVideo : styles.videoImage}
                useNativeControls={true}  // Show controls for play, pause, etc.
                resizeMode="contain" // Make the video fit
                isPaused={paused}   // Set video paused state
                onPlaybackStatusUpdate={(status) => {
                  if (status.didJustFinish) {
                    setPaused(true); // Reset paused state when video ends
                  }
                }} // Handle video finish event
                onError={(e) => console.error('Video playback error:', e)} // Handle errors
              />
            </TouchableOpacity>
          ) : (
            <Image source={{ uri: 'https://via.placeholder.com/300x150' }} style={styles.videoImage} />
          )}
        </View>

        {/* Bio Section */}
        <Text style={styles.bio}>{student.interest ? student.interest : 'No additional bio available.'}</Text>
      </ScrollView>

      {/* Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/home.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MessageScreen')}>
          <Image source={require('../assets/message.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
          <Image source={require('../assets/notification.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={require('../assets/settings.png')} style={styles.footerIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 80, // Added bottom padding to prevent footer overlap
  },
  topHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 95, // Increased height for the header
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 0 : 20,
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  headerName: {
    fontSize: 20, // Increased font size for visibility
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginLeft: 40,
    lineHeight: 60,
  },
  scrollContainer: {
    paddingTop: 120, // Adjusted to account for the increased header height
    paddingBottom: 80, // Add space for the fixed footer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 16,
    color: '#666',
  },
  location: {
    fontSize: 14,
    color: '#999',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  infoValue: {
    fontWeight: 'normal',
    color: '#666',
  },
  videoPlaceholder: {
    marginVertical: 20,
    alignItems: 'center',
  },
  videoContainer: {
    width: '90%',
    height: 150,
    borderRadius: 10,
  },
  videoImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  fullscreenVideo: {
    width: '100%',
    height: 300, // Adjust height for fullscreen video
  },
  bio: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 10,
  },
  footerIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default ReadMorePage;
