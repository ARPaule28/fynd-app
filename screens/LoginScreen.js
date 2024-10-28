import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigation = useNavigation(); // Get the navigation prop

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: data.email,
        password: data.password,
      });
  
      if (response.data) {
        Alert.alert('Login Successful', `Welcome ${data.email}`);
        // Store access token in local storage
        await AsyncStorage.setItem('accessToken', response.data.accessToken);
        // Navigate to Home screen
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials or server error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Controller
        control={control}
        rules={{ required: true }}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>Email is required</Text>}

      <Controller
        control={control}
        rules={{ required: true }}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>Password is required</Text>}

      <Button title="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
