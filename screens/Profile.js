import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';

export default function Profile({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null); // To store the profile image URI
  const [notifications, setNotifications] = useState({
    orderStatus: true,
    passwordChange: false,
    specialOffers: true,
    newsletter: false,
  });

  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isFormValid, setIsFormValid] = useState(true);

  // Load stored data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedLastName = await AsyncStorage.getItem('lastName');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPhone = await AsyncStorage.getItem('phone');
        const storedNotifications = await AsyncStorage.getItem('notifications');
        const storedImage = await AsyncStorage.getItem('profileImage');

        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
        if (storedEmail) setEmail(storedEmail);
        if (storedPhone) setPhone(storedPhone);
        if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
        if (storedImage) setProfileImage(storedImage);
      } catch (e) {
        console.error('Failed to load data:', e);
      }
    };

    fetchData();
  }, []);

  // Validate inputs
  const validateFirstName = (name) => {
    const isValid = /^[A-Za-z]+$/.test(name); // Only alphabets allowed
    setIsFirstNameValid(isValid);
    setFirstName(name);
  };

  const validateEmail = (email) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Basic email format
    setIsEmailValid(isValid);
    setEmail(email);
  };

  const validatePhone = (phone) => {
    if (phone === '') {
      setIsPhoneValid(true); // Phone is optional, so an empty value is valid
    } else {
      const isValid = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone); // Valid USA phone number
      setIsPhoneValid(isValid);
    }
    setPhone(phone);
  };

  useEffect(() => {
    // Determine form validity
    setIsFormValid(isFirstNameValid && isEmailValid && isPhoneValid);
  }, [isFirstNameValid, isEmailValid, isPhoneValid]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clear all AsyncStorage data
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding2' }], // Navigate to the Onboarding screen
      });
    } catch (e) {
      console.error('Failed to log out:', e);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure? Logging out will erase all data and destroy the account.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: handleLogout },
      ],
      { cancelable: true }
    );
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('firstName', firstName);
      await AsyncStorage.setItem('lastName', lastName);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('phone', phone);
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
  
      if (profileImage) {
        await AsyncStorage.setItem('profileImage', profileImage); // Save the image if it exists
      } else {
        await AsyncStorage.removeItem('profileImage'); // Remove the image if none is set
      }
  
      alert('Changes saved!');
      navigation.replace('Profile2'); // Reload the Profile screen
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Save the image URI
    }
  };

  const getInitials = () => {
    const firstInitial = firstName ? firstName[0].toUpperCase() : '';
    const lastInitial = lastName ? lastName[0].toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <>
    <Header />
    <ScrollView style={styles.container} keyboardDismissMode="on-drag">
      <Text style={styles.header}>Personal information</Text>
      <View style={styles.avatarContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{getInitials()}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Change</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.removeButton]}
          onPress={() => setProfileImage(null)}
        >
          <Text style={[styles.buttonText, styles.removeButtonText]}>Remove</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[
          styles.input,
          !isFirstNameValid && firstName ? styles.inputError : null,
        ]}
        value={firstName}
        onChangeText={validateFirstName}
        placeholder="First name (Mandatory)"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last name (Optional)"
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
      <TextInput
        style={[
          styles.input,
          !isPhoneValid && phone ? styles.inputError : null,
        ]}
        value={phone}
        onChangeText={validatePhone}
        placeholder="Phone number (Optional)"
        keyboardType="phone-pad"
        placeholderTextColor="#888"
      />

      <Text style={styles.subHeader}>Email notifications</Text>
      {Object.keys(notifications).map((key) => (
        <View style={styles.switchContainer} key={key}>
          <Text style={styles.switchLabel}>
            {key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase())}
          </Text>
          <Switch
            value={notifications[key]}
            onValueChange={(value) =>
              setNotifications((prev) => ({ ...prev, [key]: value }))
            }
          />
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutButtonText}>Log out</Text>
      </TouchableOpacity>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionButton, styles.discardButton]}
          onPress={() => {
            Alert.alert('Discard', 'Changes discarded!');
            navigation.replace('Profile2'); // Reload the Profile screen
          }}
        >
          <Text style={styles.discardButtonText}>Discard changes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton, !isFormValid ? styles.saveButtonDisabled : null]}
          onPress={handleSave}
          disabled={!isFormValid}
        >
          <Text style={styles.saveButtonText}>Save changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#F5F5F5',
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    avatarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 20,
    },
    placeholder: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#EDEFEE',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 20,
    },
    placeholderText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#495E57',
    },
    button: {
      backgroundColor: '#495E57',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginRight: 10,
    },
    removeButton: {
      backgroundColor: '#EDEFEE',
    },
    removeButtonText: {
      color: '#333',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      marginBottom: 15,
      paddingHorizontal: 10,
      backgroundColor: 'white',
    },
    inputError: {
      borderColor: 'red',
    },
    subHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    switchLabel: {
      fontSize: 14,
    },
    logoutButton: {
      backgroundColor: '#FFD700',
      paddingVertical: 15,
      alignItems: 'center',
      borderRadius: 5,
      marginTop: 20,
    },
    logoutButtonText: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 16,
    },
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 15,
      alignItems: 'center',
      borderRadius: 5,
    },
    discardButton: {
      backgroundColor: '#EDEFEE',
      marginRight: 10,
    },
    saveButton: {
      backgroundColor: '#495E57',
    },
    discardButtonText: {
      color: '#333',
      fontWeight: 'bold',
    },
    saveButtonDisabled: {
      backgroundColor: '#888',
    },
    saveButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });