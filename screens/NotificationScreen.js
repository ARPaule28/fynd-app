import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform, StatusBar } from 'react-native';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStudent, setCurrentStudent] = useState(null); // For user profile

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const studentId = await AsyncStorage.getItem('studentId');

        if (!accessToken || !studentId) {
          navigation.navigate('Login');
          return;
        }

        // Placeholder: Fetch notifications or simulate empty list
        // const response = await axios.get('https://fyndapi.westcentralus.cloudapp.azure.com/notifications', {
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // });
        // setNotifications(response.data || []);

        // Fetch current student for profile display
        const currentStudentResponse = await axios.get(`https://fyndapi.westcentralus.cloudapp.azure.com/students/${studentId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCurrentStudent(currentStudentResponse.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
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

      {/* Notifications Section */}
      <View style={styles.notificationContainer}>
        {notifications.length === 0 ? (
          <Text style={styles.noNotificationText}>No new notifications</Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.notificationCard}>
                <Image
                  source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                  style={styles.notificationImage}
                />
                <View style={styles.notificationDetails}>
                  <Text style={styles.notificationText}>{item.message}</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate('MessageScreen')}>
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
  notificationContainer: {
    flex: 1,
    padding: 20,
  },
  noNotificationText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  notificationCard: {
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
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: 'bold',
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

export default NotificationScreen;
