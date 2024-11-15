import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null); // State for the logged-in student
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Newest Account');

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
        const response = await axios.get('http://localhost:3000/students', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setStudents(response.data);

        // Fetch the current logged-in student info using the studentId
        const currentStudentResponse = await axios.get(`http://localhost:3000/students/${studentId}`, {
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
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
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

      {/* Students List */}
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>New Students</Text>
        {students.map((student) => (
          <View key={student.id} style={styles.studentCard}>
            <View style={styles.studentInfo}>
              <Image source={{ uri: student.profile_image }} style={styles.studentProfileImage} />
              <View style={styles.studentDetails}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentTitle}>{student.title}</Text>
                <Text style={styles.studentDescription}>
                  {student.bio ? student.bio : 'No description available.'}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('ReadMorePage', { student })}>
                  <Text style={styles.readMore}>READ MORE</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.timestamp}>{student.registration_date}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Image source={require('../assets/home.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/message.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 50,
    height: 50,
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
});

export default HomeScreen;
