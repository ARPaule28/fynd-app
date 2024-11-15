import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SkillsScreen() {
  const navigation = useNavigation();
  const [skills, setSkills] = useState({
    employability: {
      'Communication': false,
      'Teamwork': false,
      'Reliability': false,
      'Problem-solving': false,
      'Organize': false,
      'Initiative': false,
      'Self-Management': false,
      'Leadership': false,
      'Self-Learning': false,
      'Technological Knowledge': false,
      'Others': '',
    },
    soft: {
      'Dependability': false,
      'Empathy': false,
      'Patience': false,
      'Negotiation': false,
      'Integrity': false,
      'Time management': false,
      'Resourcefulness': false,
      'Stress management': false,
      'Conflict management': false,
      'Creativity': false,
      'Others': '',
    },
    technical: {
      'SEO': false,
      'Data Analysis': false,
      'Programming': false,
      'Digital Design': false,
      'Technical Writing': false,
      'Social Media': false,
      'Video Creation': false,
      'Operating Systems': false,
      'Project Management': false,
      'Computer Literacy': false,
      'Others': '',
    },
    personal: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const toggleSkill = (category, skill) => {
    setSkills((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [skill]: !prevState[category][skill],
      },
    }));
  };

  const handleDone = async () => {
    const studentId = await AsyncStorage.getItem('studentId');
    const token = await AsyncStorage.getItem('accessToken');

    if (!studentId || !token) {
      Alert.alert('Error', 'Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      // Send the updated skills to the backend
      const response = await axios.put(
        `http://localhost:3000/students/${studentId}`, // Replace with your API endpoint
        skills,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // If successful, navigate to CareerPathwaysScreen
        navigation.navigate('CareerPathwaysScreen', { studentId, token });
      } else {
        Alert.alert('Failed', 'Failed to update skills, please try again.');
      }
    } catch (error) {
      console.error('Error updating skills:', error);
      Alert.alert('Error', 'Error updating skills');
    }

    setIsLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Skills</Text>

      {/* Employability Skills */}
      <Text style={styles.subtitle}>Employability Skills</Text>
      <View style={styles.skillsContainer}>
        {Object.keys(skills.employability).map((skill, index) =>
          skill !== 'Others' ? (
            <TouchableOpacity
              key={index}
              style={styles.skillItem}
              onPress={() => toggleSkill('employability', skill)}
            >
              <Text style={styles.skillText}>
                {skills.employability[skill] ? '☑' : '☐'} {skill}
              </Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              key={index}
              style={styles.input}
              placeholder="Others..."
              value={skills.employability.Others}
              onChangeText={(text) =>
                setSkills((prevState) => ({
                  ...prevState,
                  employability: { ...prevState.employability, Others: text },
                }))
              }
            />
          )
        )}
      </View>

      {/* Soft Skills */}
      <Text style={styles.subtitle}>Soft Skills</Text>
      <View style={styles.skillsContainer}>
        {Object.keys(skills.soft).map((skill, index) =>
          skill !== 'Others' ? (
            <TouchableOpacity
              key={index}
              style={styles.skillItem}
              onPress={() => toggleSkill('soft', skill)}
            >
              <Text style={styles.skillText}>
                {skills.soft[skill] ? '☑' : '☐'} {skill}
              </Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              key={index}
              style={styles.input}
              placeholder="Others..."
              value={skills.soft.Others}
              onChangeText={(text) =>
                setSkills((prevState) => ({
                  ...prevState,
                  soft: { ...prevState.soft, Others: text },
                }))
              }
            />
          )
        )}
      </View>

      {/* Technical Skills */}
      <Text style={styles.subtitle}>Technical Skills</Text>
      <View style={styles.skillsContainer}>
        {Object.keys(skills.technical).map((skill, index) =>
          skill !== 'Others' ? (
            <TouchableOpacity
              key={index}
              style={styles.skillItem}
              onPress={() => toggleSkill('technical', skill)}
            >
              <Text style={styles.skillText}>
                {skills.technical[skill] ? '☑' : '☐'} {skill}
              </Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              key={index}
              style={styles.input}
              placeholder="Others..."
              value={skills.technical.Others}
              onChangeText={(text) =>
                setSkills((prevState) => ({
                  ...prevState,
                  technical: { ...prevState.technical, Others: text },
                }))
              }
            />
          )
        )}
      </View>

      {/* Personal Skills */}
      <Text style={styles.subtitle}>Personal Skills</Text>
      <TextInput
        style={styles.input}
        placeholder="Your personal skills"
        value={skills.personal}
        onChangeText={(text) =>
          setSkills((prevState) => ({
            ...prevState,
            personal: text,
          }))
        }
      />

      {/* Done Button */}
      <TouchableOpacity
        style={styles.doneButton}
        onPress={handleDone}
        disabled={isLoading}
      >
        <Text style={styles.doneButtonText}>
          {isLoading ? 'Updating...' : 'Next'}
        </Text>
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
