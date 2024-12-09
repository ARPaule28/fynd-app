import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, StatusBar } from 'react-native';
import { Video } from 'expo-av'; // Importing Video component from expo-av

const HomeScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null); // State for the logged-in student
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Newest Account'); // Default tab is 'Newest Account'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const studentId = await AsyncStorage.getItem('studentId'); // Fetch studentId from AsyncStorage

        if (!accessToken || !studentId) {
          navigation.navigate('Login'); // Redirect to login if not authenticated
          return;
        }

        // Fetch all students
        const response = await axios.get('https://fyndapi.westcentralus.cloudapp.azure.com/students', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setStudents(response.data);

        // Fetch the current logged-in student info using the studentId
        const currentStudentResponse = await axios.get(`https://fyndapi.westcentralus.cloudapp.azure.com/students/${studentId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCurrentStudent(currentStudentResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigation.navigate('Login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderYourOverview = () => {
    if (!currentStudent) {
      return <Text>No student data available</Text>;
    }
  
    return (
      <View style={styles.overviewContainer}>
        {/* Profile Image and Name */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: currentStudent?.profile_image || 'https://via.placeholder.com/150' }}
            style={styles.overviewImage}
          />
          <View style={styles.profileText}>
            <Text style={styles.overviewName}>{currentStudent.name}</Text>
            <Text style={styles.overviewTitle}>Careers: {currentStudent.careers || 'No career specified'}</Text>
            <Text style={styles.overviewTitle}>
              Address: {currentStudent.address || 'No address provided'}
            </Text>
          </View>
        </View>
  
        {/* Skills, Nationality, and Other Info */}
        <View style={styles.additionalInfo}>
          <Text style={styles.overviewSkills}>Skills: {currentStudent.skills || 'N/A'}</Text>
          <Text style={styles.overviewTitle}>
            Nationality: {currentStudent.race || 'Not specified'}
          </Text>
        </View>
  
        {/* Video Highlight */}
        <View style={styles.videoContainer}>
          {currentStudent.video_highlight ? (
            <Video
              source={{ uri: currentStudent.video_highlight }}
              style={styles.videoPlayer}
              controls
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>No video highlight available</Text>
            </View>
          )}
        </View>
  
        {/* Bio or Description */}
        <Text style={styles.overviewDescription}>
          {currentStudent.interest || 'This student has not added a bio yet.'}
        </Text>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          {currentStudent && (
            <>
              <Image
                source={{
                  uri: currentStudent?.profile_image || 'https://via.placeholder.com/150',
                }}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>{currentStudent.name}</Text>
            </>
          )}
        </View>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Newest Account')}>
          <Text style={[styles.tabText, activeTab === 'Newest Account' && styles.activeTab]}>
            Newest Account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Best Matches')}>
          <Text style={[styles.tabText, activeTab === 'Best Matches' && styles.activeTab]}>
            Best Matches
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Your Overview')}>
          <Text style={[styles.tabText, activeTab === 'Your Overview' && styles.activeTab]}>
            Your Overview
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Based on Active Tab */}
      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'Newest Account' &&
          students.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <Image
                  source={{ uri: student.profile_image || 'https://via.placeholder.com/150' }}
                  style={styles.studentProfileImage}
                />
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentTitle}>{student.title}</Text>
                  <Text style={styles.studentDescription}>
                    {student.interest ? student.interest : 'No description available.'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ReadMorePage', { studentId: student.id })}
                  >
                    <Text style={styles.readMore}>READ MORE</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.timestamp}>{student.registration_date}</Text>
            </View>
          ))}
        {activeTab === 'Your Overview' && renderYourOverview()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20, // Add space for Android's status bar
    paddingBottom: 20, // Ensure padding below
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height: 100, // Explicit height for consistency
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1, // Allow profile container to shrink if needed
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    fontSize: 16, // Slightly smaller text for better fit
    fontWeight: 'bold',
    flexShrink: 1, // Prevent overflow of text
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain', // Prevent logo distortion
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTab: {
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#ff6f00',
    paddingBottom: 5,
  },
  scrollContainer: {
    flex: 1,  // Take up remaining space
    padding: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  studentInfo: {
    flexDirection: 'row',
  },
  studentProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentTitle: {
    fontSize: 16,
    color: '#666',
  },
  studentDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  readMore: {
    color: '#ff6f00',
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerIcon: {
    width: 30,
    height: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileText: {
    flex: 1,
  },
  overviewName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  overviewTitle: {
    fontSize: 14,
    color: '#555',
  },
  overviewSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  additionalInfo: {
    marginTop: 10,
  },
  overviewSkills: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  videoContainer: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoPlayer: {
    width: '100%',
    height: 200,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#888',
  },
  overviewDescription: {
    marginTop: 15,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  
});

export default HomeScreen;
