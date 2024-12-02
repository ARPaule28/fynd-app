import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import SettingsScreen from './screens/SettingsScreen';
import ReadMorePage from './screens/ReadMorePage';
import AdditionalInfoScreen from './screens/AdditionalInfoScreen';
import SkillsScreen from './screens/SkillsScreen';
import CareerPathwaysScreen from './screens/CareerPathwaysScreen';
import HighlightVideoScreen from './screens/HighlightVideoScreen';
import ProfileImageScreen from './screens/ProfileImageScreen';
import NotificationScreen from './screens/NotificationScreen';
import MessageScreen from './screens/MessageScreen';
import AccountSettingsScreen from './screens/AccountSettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ReadMorePage" component={ReadMorePage} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AdditionalInfoScreen" component={AdditionalInfoScreen} />
        <Stack.Screen name="SkillsScreen" component={SkillsScreen} />
        <Stack.Screen name="CareerPathwaysScreen" component={CareerPathwaysScreen} />
        <Stack.Screen name="HighlightVideoScreen" component={HighlightVideoScreen} />
        <Stack.Screen name="ProfileImageScreen" component={ProfileImageScreen} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        <Stack.Screen name="MessageScreen" component={MessageScreen} />
        <Stack.Screen name="AccountSettingsScreen" component={AccountSettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
