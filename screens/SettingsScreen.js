import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform, StatusBar } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    const fetchCurrentStudent = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const studentId = await AsyncStorage.getItem('studentId');

        if (!accessToken || !studentId) {
          navigation.navigate('Login');
          return;
        }

        const response = await axios.get(`http://4.255.218.174/students/${studentId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setCurrentStudent(response.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
        setCurrentStudent(null);
      }
    };

    fetchCurrentStudent();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      navigation.navigate('Login');
      Alert.alert('Logged Out', 'You have been logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Logout Failed', 'An error occurred while logging out.');
    }
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

      {/* Settings Options */}
      <View style={styles.settingsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="user" size={20} color="#666" />
          <Text style={styles.optionText}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('AccountSettingsScreen')}
        >
          <Icon name="cog" size={20} color="#666" />
          <Text style={styles.optionText}>Account Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => setLogoutModalVisible(true)} // Show the modal
        >
          <Icon name="sign-out" size={20} color="#666" />
          <Text style={styles.optionText}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setLogoutModalVisible(false);
                  handleLogout();
                }}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Footer Navigation */}
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
        <TouchableOpacity>
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
    paddingBottom: 60, // Space for the footer
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
  settingsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  optionText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#D9D9D8', // Corrected background color
  },
  cancelButton: {
    backgroundColor: '#D9D9D8', // Same color as confirmButton
  },
  modalButtonText: {
    color: '#000',
    fontSize: 16,
  },
});


export default SettingsScreen;
