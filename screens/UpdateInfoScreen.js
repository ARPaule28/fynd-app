import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker'; // Correct import

export default function UpdateInfoScreen({ navigation }) {
  // State for all fields
  const [streetAddress, setStreetAddress] = useState('');
  const [streetAddressLine2, setStreetAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sex, setSex] = useState('');
  const [race, setRace] = useState('');
  const [interest, setInterests] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const studentId = await AsyncStorage.getItem('studentId');

    if (!accessToken || !studentId) {
      alert('Error retrieving authentication details.');
      return;
    }

    const address = `${streetAddress}, ${streetAddressLine2}, ${city}, ${state}, ${postalCode}`;

    const data = {
      address,
      phoneNumber,
      sex,
      race,
      interest,
      birth_date: birthdate || null, // Set to null if empty
    };

    try {
      const response = await fetch(`https://fyndapi.westcentralus.cloudapp.azure.com/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Information updated successfully!');
        navigation.navigate('UpdateSkillsScreen');
      } else {
        alert('Failed to update. Please try again.');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Update Information</Text>

      <Text style={styles.label}>ADDRESS:</Text>
      <TextInput
        style={styles.input}
        placeholder="Street Address"
        value={streetAddress}
        onChangeText={setStreetAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Street Address Line 2"
        value={streetAddressLine2}
        onChangeText={setStreetAddressLine2}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="State/Province"
          value={state}
          onChangeText={setState}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Postal/Zipcode"
        value={postalCode}
        onChangeText={setPostalCode}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        keyboardType="numeric"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
      />

      <Text style={styles.label}>BIRTHDATE:</Text>
      {Platform.OS === 'web' ? (
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={birthdate}
          onChangeText={setBirthdate}
        />
      ) : (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {birthdate ? birthdate : 'Select Birthdate'}
          </Text>
        </TouchableOpacity>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setBirthdate(selectedDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
            }
          }}
        />
      )}

      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>SEX:</Text>
        <RNPickerSelect
          onValueChange={(value) => setSex(value)}
          items={[
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
            { label: 'Other', value: 'Other' },
          ]}
          placeholder={{ label: 'Select Sex', value: null }}
          style={{
            ...pickerSelectStyles,
            placeholder: {
              color: '#888',
            },
          }}
        />
      </View>

      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>RACE:</Text>
        <RNPickerSelect
          onValueChange={(value) => setRace(value)}
          items={[
            { label: 'Asian', value: 'Asian' },
            { label: 'African', value: 'African' },
            { label: 'Caucasian', value: 'Caucasian' },
            { label: 'Hispanic', value: 'Hispanic' },
            { label: 'Other', value: 'Other' },
          ]}
          placeholder={{ label: 'Select Race', value: null }}
          style={{
            ...pickerSelectStyles,
            placeholder: {
              color: '#888',
            },
          }}
        />
      </View>

      <TextInput
        style={styles.textArea}
        placeholder="Enter your interests, e.g., music, dancing, reading books"
        value={interest}
        onChangeText={setInterests}
        multiline={true}
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>NEXT</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingVertical: 12,
  },
  dropdownContainer: {
    marginBottom: 15,
    width: '100%',
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  textArea: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#ff6f00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: '100%',
    height: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputAndroid: {
    width: '100%',
    height: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#333',
  },
});
