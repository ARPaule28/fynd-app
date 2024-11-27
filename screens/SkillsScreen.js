import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

  const handleSubmit = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const studentId = await AsyncStorage.getItem('studentId');

    if (!accessToken || !studentId) {
      Alert.alert('Error', 'Error retrieving authentication details.');
      return;
    }

    // Concatenate all the selected skills into a single string
    const skillsData = {
      employabilitySkills: Object.keys(skills.employability)
        .filter((skill) => skills.employability[skill] && skill !== 'Others')
        .join(', '),
      softSkills: Object.keys(skills.soft)
        .filter((skill) => skills.soft[skill] && skill !== 'Others')
        .join(', '),
      technicalSkills: Object.keys(skills.technical)
        .filter((skill) => skills.technical[skill] && skill !== 'Others')
        .join(', '),
      personalSkills: skills.personal.trim() ? skills.personal : '',
    };

    // Combine all skills into one string
    const allSkills = [
      skillsData.employabilitySkills,
      skillsData.softSkills,
      skillsData.technicalSkills,
      skillsData.personalSkills,
    ]
      .filter((category) => category) // Remove any empty categories
      .join(', ');

    const data = { skills: allSkills };

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
        Alert.alert('Success', 'Skills updated successfully!');
        navigation.navigate('CareerPathwaysScreen'); // Change to the appropriate next screen
      } else {
        Alert.alert('Error', 'Failed to update skills. Please try again.');
      }
    } catch (error) {
      console.error('Error updating skills:', error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };

  const toggleSkill = (category, skill) => {
    setSkills((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [skill]: !prevState[category][skill],
      },
    }));
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
        onPress={handleSubmit}
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
