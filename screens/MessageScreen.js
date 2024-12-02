import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform, StatusBar } from 'react-native';

const MessageScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStudent, setCurrentStudent] = useState(null); // For user profile

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const studentId = await AsyncStorage.getItem('studentId');

        if (!accessToken || !studentId) {
          navigation.navigate('Login');
          return;
        }

        // Placeholder: Simulating an empty message list since no messages API exists
        setMessages([]);

        // Fetch the current logged-in student's info
        const currentStudentResponse = await axios.get(`http://4.255.218.174/students/${studentId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCurrentStudent(currentStudentResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
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
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      {/* Messages Section */}
      <View style={styles.messageContainer}>
        {messages.length === 0 ? (
          <Text style={styles.noMessagesText}>No new messages</Text>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.messageCard}>
                <Image
                  source={{
                    uri: item.senderImage || 'https://via.placeholder.com/150',
                  }}
                  style={styles.messageImage}
                />
                <View style={styles.messageDetails}>
                  <Text style={styles.senderName}>{item.senderName}</Text>
                  <Text style={styles.messageText}>{item.message}</Text>
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/home.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  messageContainer: {
    flex: 1,
    padding: 20,
  },
  noMessagesText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  messageCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  messageImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  messageDetails: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
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
});

export default MessageScreen;