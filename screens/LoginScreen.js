import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Alert, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm, Controller } from 'react-hook-form';
import RNSslPinning from 'react-native-ssl-pinning';

export default function LoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigation = useNavigation();

  const onSubmit = async (data) => {
    try {
      // Axios configuration with SSL pinning for self-signed certificates
      const response = await axios.post(
        'https://fyndapi.westcentralus.cloudapp.azure.com/auth/login',
        { email: data.email, password: data.password },
        {
          // This is the key part where SSL pinning is enabled for the request
          httpsAgent: new RNSslPinning({ 
            certs: ['cert/FYND APP.crt'], // Provide the path to your self-signed cert
            disableSslVerification: true, // Disable SSL verification
          }),
        }
      );

      if (response.data) {
        Alert.alert('Login Successful', `Welcome ${data.email}`);
        const { accessToken, hasAdditionalInfo, user } = response.data;
        const studentId = user.student;  // Extract studentId from the user object

        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('studentId', studentId.toString()); // Ensure studentId is stored as a string

        // Navigate based on the additional info status
        if (hasAdditionalInfo) {
          navigation.navigate('Home', { studentId }); // Pass studentId to Home
        } else {
          navigation.navigate('AdditionalInfoScreen', { studentId }); // Pass studentId to AdditionalInfoScreen
        }
      }
    } catch (error) {
      console.error(error); // Log detailed error for debugging
      Alert.alert('Login Failed', 'Invalid credentials or server error');
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

      {/* Title */}
      <Text style={styles.title}>FYND</Text>

      {/* Tagline */}
      <Text style={styles.tagline}>Helping you fynd your next career</Text>

      {/* Email Input */}
      <Controller
        control={control}
        rules={{ required: true }}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={value || ''} // Default to empty string to avoid undefined
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
            value={value || ''} // Default to empty string to avoid undefined
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>Password is required</Text>}

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerButtonText}>Register</Text>
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
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
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
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#ff6f00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  registerButtonText: {
    color: '#333',
    fontSize: 16,
  },
});
