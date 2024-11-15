import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const ReadMorePage = ({ route }) => {
  const { student } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Top Header with Back Button and Student Name */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerName}>{student.name}</Text>
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

        {/* Video Placeholder */}
        <View style={styles.videoPlaceholder}>
          <Image source={{ uri: 'https://via.placeholder.com/300x150' }} style={styles.videoImage} />
        </View>

        {/* Bio Section */}
        <Text style={styles.bio}>{student.interest ? student.interest : 'No additional bio available.'}</Text>

        {/* Send Message Button */}
        <TouchableOpacity style={styles.sendMessageButton}>
          <Text style={styles.sendMessageText}>SEND MESSAGE</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 11,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    paddingBottom: 80, // Space for the footer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
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
  videoImage: {
    width: '90%',
    height: 150,
    borderRadius: 10,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 20,
    marginVertical: 10,
    lineHeight: 20,
  },
  sendMessageButton: {
    backgroundColor: '#ff6f00',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  sendMessageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default ReadMorePage;
