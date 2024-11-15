import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function AdditionalInfoScreen() {
  const navigation = useNavigation();
  const { control, handleSubmit, formState: { errors } } = useForm();

  const [studentId, setStudentId] = useState(null); // Store studentId from AsyncStorage
  const [isLoading, setIsLoading] = useState(false); // For disabling the button during submission

  useEffect(() => {
    // Fetch the studentId and access token when the component mounts
    const fetchStudentData = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      const id = await AsyncStorage.getItem('studentId'); // Assuming the studentId is stored in AsyncStorage

      if (!token) {
        Alert.alert('Unauthorized', 'Please log in again.');
        navigation.navigate('Login'); // Navigate to login if no token is found
        return;
      }

      if (!id) {
        Alert.alert('Error', 'Student ID not found. Please log in again.');
        navigation.navigate('Login'); // Navigate to login if no studentId is found
        return;
      }

      setStudentId(id); // Set studentId
    };

    fetchStudentData();
  }, [navigation]);

  const onSubmit = async (data) => {
    if (!studentId) {
      Alert.alert('Error', 'Student ID not found. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      // Combine address fields into one string
      const fullAddress = `${data.address}, ${data.address_line_2}, ${data.city}, ${data.state}, ${data.zipcode}`;

      // Prepare form data for sending
      const formData = new FormData();
      formData.append('address', fullAddress);

      // Add all other form fields (except address-related fields)
      for (const [key, value] of Object.entries(data)) {
        if (key !== 'address' && key !== 'address_line_2' && key !== 'city' && key !== 'state' && key !== 'zipcode') {
          if (value) {
            formData.append(key, value);
          }
        }
      }

      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Unauthorized', 'Please log in again.');
        setIsLoading(false);
        return;
      }

      // Send the update request
      const response = await axios.put(
        `http://localhost:3000/students/${studentId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Information Updated', 'Your details have been successfully updated!');
        navigation.navigate('SkillsScreen', { studentId, token }); // Navigate to SkillsScreen after update
      } else {
        Alert.alert('Update Failed', 'There was an error updating your information.');
      }
    } catch (error) {
      console.error("Error during API request:", error);
      Alert.alert('Update Failed', 'There was an error updating your information.');
    }

    setIsLoading(false); // Reset loading state
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Additional Information</Text>

      {/* Address Fields */}
      <Text style={styles.label}>Address:</Text>
      <Controller
        control={control}
        name="address"
        defaultValue=""
        rules={{ required: 'Street address is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Street Address"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}

      <Controller
        control={control}
        name="address_line_2"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Street Address Line 2"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <View style={styles.row}>
        <Controller
          control={control}
          name="city"
          defaultValue=""
          rules={{ required: 'City is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}

        <Controller
          control={control}
          name="state"
          defaultValue=""
          rules={{ required: 'State/Province is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="State/Province"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.state && <Text style={styles.errorText}>{errors.state.message}</Text>}
      </View>

      <Controller
        control={control}
        name="zipcode"
        defaultValue=""
        rules={{ required: 'Zipcode is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Postal/Zipcode"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.zipcode && <Text style={styles.errorText}>{errors.zipcode.message}</Text>}

      {/* Phone Number */}
      <Text style={styles.label}>Phone Number:</Text>
      <Controller
        control={control}
        name="phone"
        defaultValue=""
        rules={{ required: 'Phone number is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

      {/* Interests */}
      <Controller
        control={control}
        name="interest"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Interest (e.g., music, dancing)"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        <Text style={styles.submitButtonText}>
          {isLoading ? 'Updating...' : 'Next'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 15 },
  label: { fontSize: 14, marginBottom: 5, color: '#333' },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  halfInput: { width: '48%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  submitButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: { color: '#fff', fontSize: 16 },
  errorText: { color: 'red', fontSize: 12, marginBottom: 10 },
});
