import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Banner from '../components/Banner';

import Header from '../components/Header';

export default function Onboarding({ navigation }) {
  const [name, onChangeName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Validate name (must contain only alphabets)
  const validateName = (name) => {
    const isValid = /^[A-Za-z]+$/.test(name);
    setIsNameValid(isValid);
    onChangeName(name);
  };

  // Validate email (basic email format validation)
  const validateEmail = (email) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsEmailValid(isValid);
    onChangeEmail(email);
  };

  // Function to handle onboarding completion
  const completeOnboarding = async () => {
    try {
      // Save data to AsyncStorage
      await AsyncStorage.setItem('firstName', name); // Save name as 'firstName'
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('onboardingCompleted', 'true'); // Save onboarding completion status

      navigation.navigate('Home2');
    } catch (e) {
      console.error('Failed to save onboarding data:', e);
    }
  };

  // Check if the form is valid
  const isFormValid = isNameValid && isEmailValid;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <Header />
      <ScrollView
        indicatorStyle="white"
        keyboardDismissMode="on-drag"
        style={styles.container}
      >
        <Banner />
        <View>
          <Text style={styles.headerText}>Let us get to know you</Text>

          <TextInput
            style={[
              styles.input,
              !isNameValid && name ? styles.inputError : null,
            ]}
            value={name}
            onChangeText={validateName}
            placeholder="First name (Mandatory)"
            placeholderTextColor="#888"
          />

          <TextInput
            style={[
              styles.input,
              !isEmailValid && email ? styles.inputError : null,
            ]}
            value={email}
            onChangeText={validateEmail}
            placeholder="Email (Mandatory)"
            keyboardType="email-address"
            placeholderTextColor="#888"
          />

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={completeOnboarding} // Call completeOnboarding when "Next" is pressed
              disabled={!isFormValid} // Disable button if form is invalid
              style={[
                styles.button,
                !isFormValid ? styles.buttonDisabled : null,
              ]}
            >
              <Text style={styles.buttonText}>Next</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    padding: 10,
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderColor: '#EDEFEE',
    backgroundColor: '#EDEFEE',
    borderRadius: 10,
  },
  inputError: {
    borderColor: 'red', // Highlight input box in red if validation fails
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#495E57',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  buttonDisabled: {
    backgroundColor: '#888', // Dimmed color for disabled button
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});