import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { height: screenHeight } = Dimensions.get('window');

export default function Header() {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch onboarding status
        const isOnboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
        setOnboardingCompleted(isOnboardingCompleted === 'true');

        // Fetch profile image
        const storedImage = await AsyncStorage.getItem('profileImage');
        if (storedImage) {
          setProfileImage(storedImage); // Set the image if it exists
        }
      } catch (e) {
        console.error('Failed to fetch data from AsyncStorage:', e);
      }
    };

    fetchData();
  }, []);

  const handleLogoNavigation = () => {
    navigation.navigate('Home2'); // Navigate to the Home page
  };

  const handleProfileNavigation = () => {
    navigation.navigate('Profile2'); // Navigate to the Profile page
  };

  return (
    <View style={[styles.container, { height: screenHeight * 0.13 }]}>
      {/* Logo Navigation */}
      {onboardingCompleted ? (
         <TouchableOpacity onPress={handleLogoNavigation}>
          <Image style={styles.logo} source={require('../assets/Logo.png')} />
        </TouchableOpacity>
        ) : (
          <Image style={styles.logo} source={require('../assets/Logo.png')} />
      )}

      {/* Profile Image or Default Image Navigation */}
      {onboardingCompleted && (
        <TouchableOpacity onPress={handleProfileNavigation}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('../assets/settings.png') // Default profile image
            }
            style={styles.profileImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logo: {
    resizeMode: 'cover',
    marginTop: 25,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 50,
    marginTop: 25,
  },
});