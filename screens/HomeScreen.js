import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken'); // Retrieve access token
        const response = await axios.get('http://localhost:3000/students', {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include access token in the header
          },
        });
        setStudents(response.data); // Assuming response.data is the array of students
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {students.map((student) => (
        <View key={student.id} style={styles.studentCard}>
          <Image source={{ uri: student.profile_image }} style={styles.profileImage} />
          <Text style={styles.studentName}>{student.name}</Text>
          <Text>Username: {student.username}</Text>
          <Text>Email: {student.email}</Text>
          <Text>Registration Date: {new Date(student.registration_date).toLocaleDateString()}</Text>
          <Text>Birth Date: {new Date(student.birth_date).toLocaleDateString()}</Text>
          <Text>Address: {student.address}</Text>
          <Text>Sex: {student.sex}</Text>
          <Text>Race: {student.race}</Text>
          <Text>Certificate: {student.certificate}</Text>
          <Text>Skills: {student.skills}</Text>
          <Text>Careers: {student.careers}</Text>
          <Text>Interests: {student.interest}</Text>
          <Text>Video Highlight: {student.video_highlight}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    studentCard: {
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      padding: 20,
      marginBottom: 15,
      elevation: 2, // Add shadow on Android
      shadowColor: '#000', // Add shadow on iOS
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
    },
    studentName: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignSelf: 'center',
      marginBottom: 10,
    },
  });

export default HomeScreen;
