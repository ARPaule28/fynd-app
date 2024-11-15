import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Image, RadioButton } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export default function RegisterScreen() {
  const { control, handleSubmit, formState: { errors }, watch } = useForm();
  const navigation = useNavigation();
  const [accountType, setAccountType] = useState('Student');

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert('Passwords do not match', 'Please make sure your passwords are the same.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/students/', {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (response.data) {
        Alert.alert('Registration Successful', 'Your account has been created.');
        await AsyncStorage.setItem('accessToken', response.data.accessToken);
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Registration Failed', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../assets/logo.png')}  // Reference your logo from the assets folder
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Create new Account</Text>
      <Text style={styles.linkText}>Already Registered? <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Log in here.</Text></Text>

      {/* Name Input */}
      <Controller
        control={control}
        rules={{ required: true }}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={value || ''}
            onChangeText={onChange}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>Name is required</Text>}

       {/* Username Input */}
       <Controller
        control={control}
        rules={{ required: true }}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={value || ''}
            onChangeText={onChange}
          />
        )}
      />
      {errors.username && <Text style={styles.error}>Username is required</Text>}

      {/* Email Input */}
      <Controller
        control={control}
        rules={{ required: true }}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={value || ''}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>Email is required</Text>}

      {/* Password Input */}
      <Controller
        control={control}
        rules={{ required: true }}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={value || ''}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>Password is required</Text>}

      {/* Confirm Password Input */}
      <Controller
        control={control}
        rules={{ required: true }}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={value || ''}
            onChangeText={onChange}
          />
        )}
      />
      {errors.confirmPassword && <Text style={styles.error}>Confirm Password is required</Text>}

      {/* Account Type Selection */}
      <Text style={styles.accountTypeLabel}>Account Type</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity onPress={() => setAccountType('Student')} style={styles.radioButton}>
          <View style={accountType === 'Student' ? styles.radioChecked : styles.radioUnchecked} />
          <Text style={styles.radioText}>Student</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setAccountType('Parent')} style={styles.radioButton}>
          <View style={accountType === 'Parent' ? styles.radioChecked : styles.radioUnchecked} />
          <Text style={styles.radioText}>Parent</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  linkText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
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
  error: {
    color: 'red',
    marginBottom: 10,
  },
  accountTypeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
    width: '100%',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioChecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff6f00',
    marginRight: 10,
  },
  radioUnchecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 2,
    marginRight: 10,
  },
  radioText: {
    fontSize: 16,
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