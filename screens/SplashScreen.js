import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Splash Screen</Text>
      <ActivityIndicator size="large" color="#495E57" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDEFEE',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495E57',
    marginBottom: 20,
  },
});