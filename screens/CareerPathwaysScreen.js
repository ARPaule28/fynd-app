import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

  // Function to toggle options for each career pathway
  const toggleOption = (category, option) => {
    setCareerPathways((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [option]: !prevState[category][option],
      },
    }));
  };

  // Handle submit action
  const handleSubmit = async () => {
    const studentId = await AsyncStorage.getItem('studentId');
    const accessToken = await AsyncStorage.getItem('accessToken');
  
    if (!studentId || !accessToken) {
      Alert.alert('Error', 'Please log in again');
      return;
    }
  
    // Create an object to hold the selected career pathways
    const selectedCareerPathways = Object.keys(careerPathways).reduce((acc, category) => {
      const selectedOptions = Object.keys(careerPathways[category]).filter(
        (option) => careerPathways[category][option]
      );
      if (selectedOptions.length > 0) {
        // Instead of storing an object, join the selected options into a comma-separated string
        acc[category] = selectedOptions.join(', ');
      }
      return acc;
    }, {});
  
    // Convert the selected career pathways into a simple string format, without curly braces
    const formattedCareerPathways = Object.keys(selectedCareerPathways).map(category => {
      return `${category}: ${selectedCareerPathways[category]}`;
    }).join(' | '); // Joining each category's selected options with a separator (you can change ' | ' to any delimiter you prefer)
  
    const data = { careers: formattedCareerPathways }; // Use the formatted career pathways string
  
    try {
      const response = await fetch(`http://192.168.1.8:3000/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('API response:', result); // Log the result to check its structure
  
        // Assuming the API is not sending a "success" field, we can proceed with navigation directly
        // Here we assume the response data is valid if the status is ok
        if (result.id) {  // Check if result contains an ID (indicating success)
          Alert.alert('Success', 'Career pathways updated successfully!');
          console.log('Navigating to HomeScreen...');
          navigation.navigate('HighlightVideoScreen');
        } else {
          Alert.alert('Error', 'Failed to update career pathways, please try again.');
        }
      } else {
        const errorResponse = await response.json();
        console.log('Error response:', errorResponse);  // Log the error response
        Alert.alert('Error', errorResponse.message || 'Something went wrong.');
      }      
    } catch (error) {
      console.error('Error updating career pathways:', error);
      Alert.alert('Error', 'An error occurred while updating career pathways.');
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Career Pathways</Text>

      {Object.keys(careerPathways).map((category) => (
        <View key={category}>
          <Text style={styles.subtitle}>{category}</Text>
          <View style={styles.skillsContainer}>
            {Object.keys(careerPathways[category]).map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.skillItem}
                onPress={() => toggleOption(category, option)}
              >
                <Text style={styles.skillText}>
                  {careerPathways[category][option] ? '☑' : '☐'} {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Done Button */}
      <TouchableOpacity style={styles.doneButton} onPress={handleSubmit}>
        <Text style={styles.doneButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
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
  skillText: {
    fontSize: 16,
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
