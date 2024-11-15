import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CareerPathwaysScreen() {
  const navigation = useNavigation();

  // Initialize the state for career pathways
  const [careerPathways, setCareerPathways] = useState({
    'Agriculture, Food, and Natural Resources': {
      'Agribusiness Systems': false,
      'Animal Systems': false,
      'Environmental Service Systems': false,
      'Food Products and Processing Systems': false,
      'Natural Resources Systems': false,
      'Plant Systems': false,
      'Power, Structural and Technical Systems': false,
    },
    'Architecture and Construction': {
      'Construction': false,
      'Design/Pre-Construction': false,
      'Maintenance/Operations': false,
    },
    'Arts, A/V Technology, and Communications': {
      'Audio and Video Technology and Film': false,
      'Journalism and Broadcasting': false,
      'Performing Arts': false,
      'Printing Technology': false,
      'Telecommunications': false,
      'Visual Arts': false,
    },
    'Business Management and Administration': {
      'General Management': false,
      'Administrative Support': false,
      'Human Resources Management': false,
      'Business Information Management': false,
      'Operations Management': false,
    },
    'Education and Training': {
      'Administration and Administrative Support': false,
      'Professional Support Services': false,
      'Teaching/Training': false,
    },
    'Finance': {
      'Banking Services': false,
      'Business Finance': false,
      'Insurance': false,
      'Securities and Investments': false,
    },
    'Government and Public Administration': {
      'Foreign Service': false,
      'Governance': false,
      'National Security': false,
      'Planning': false,
      'Public Management and Administration': false,
      'Regulation': false,
      'Revenue and Taxation': false,
    },
    'Health Science': {
      'Biotechnology Research and Development': false,
      'Diagnostic Services': false,
      'Health Informatics': false,
      'Support Services': false,
      'Therapeutic Services': false,
    },
    'Hospitality and Tourism': {
      'Lodging': false,
      'Recreation, Amusements and Attractions': false,
      'Restaurants and Food and Beverage Services': false,
      'Travel and Tourism': false,
    },
    'Human Services': {
      'Consumer Services': false,
      'Counseling and Mental Health Services': false,
      'Early Childhood Development and Services': false,
      'Family and Community Services': false,
      'Personal Care Services': false,
    },
    'Information Technology': {
      'Information Support and Services': false,
      'Network Systems': false,
      'Programming and Software Development': false,
      'Web and Digital Communications': false,
    },
    'Law, Public Safety, Corrections, and Security': {
      'Corrections Services': false,
      'Emergency and Fire Management Services': false,
      'Law Enforcement Services': false,
      'Legal Services': false,
      'Security and Protective Services': false,
    },
    'Manufacturing': {
      'Health, Safety and Environmental Assurance': false,
      'Logistics and Inventory Control': false,
      'Maintenance, Installation and Repair': false,
      'Manufacturing Production Process Development': false,
      'Production': false,
      'Quality Assurance': false,
    },
    'Marketing': {
      'Marketing Communications': false,
      'Marketing Management': false,
      'Market Research': false,
      'Merchandising': false,
      'Professional Sales': false,
    },
    'Science, Technology, Engineering, and Mathematics': {
      'Engineering and Technology': false,
      'Science and Math': false,
    },
    'Transportation, Distribution, and Logistics': {
      'Facility and Mobile Equipment Maintenance': false,
      'Health, Safety and Environmental Management': false,
      'Logistics Planning and Management Services': false,
      'Sales and Service': false,
      'Transportation Operations': false,
      'Transportation Systems/Infrastructure': false,
      'Warehousing and Distribution Center Operations': false,
    },
  });

  const toggleOption = (category, option) => {
    setCareerPathways((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [option]: !prevState[category][option],
      },
    }));
  };

  const handleDone = async () => {
    // Check for the student ID and token in AsyncStorage before updating
    const studentId = await AsyncStorage.getItem('studentId');
    const token = await AsyncStorage.getItem('accessToken');

    if (!studentId || !token) {
      alert('Please log in again');
      return;
    }

    // Send the updated career pathways data to the backend
    try {
      const response = await axios.put(
        `http://localhost:3000/students/${studentId}`, // Replace with your API endpoint
        careerPathways,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // If successful, navigate to the HighlightVideoScreen
        navigation.navigate('HighlightVideoScreen');
      } else {
        alert('Failed to update career pathways, please try again.');
      }
    } catch (error) {
      console.error('Error updating career pathways:', error);
      alert('Error updating career pathways');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Career Pathways</Text>

      {Object.keys(careerPathways).map((category) => (
        <View key={category}>
          <Text style={styles.subtitle}>{category}</Text>
          <View style={styles.skillsContainer}>
            {Object.keys(careerPathways[category]).map((option, index) =>
              option !== 'Others' ? (
                <TouchableOpacity
                  key={index}
                  style={styles.skillItem}
                  onPress={() => toggleOption(category, option)}
                >
                  <Text style={styles.skillText}>
                    {careerPathways[category][option] ? '☑' : '☐'} {option}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TextInput
                  key={index}
                  style={styles.input}
                  placeholder="Others..."
                  value={careerPathways[category].Others}
                  onChangeText={(text) =>
                    setCareerPathways((prevState) => ({
                      ...prevState,
                      [category]: { ...prevState[category], Others: text },
                    }))
                  }
                />
              )
            )}
          </View>
        </View>
      ))}

      {/* Done Button */}
      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 15, marginBottom: 10 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  skillItem: {
    width: '48%',
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  skillText: { fontSize: 16 },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
