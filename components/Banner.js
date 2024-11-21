import * as React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
//import { useFonts } from "expo-font";

export default function Banner() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Little Lemon</Text>
      <Text style={styles.subHeaderText}>Chicago</Text>
      <View style={styles.rowContainer}>
        <Text style={styles.regularText}>
          We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
        </Text>
        <Image style={styles.image} source={require('../assets/images/Hero_image.jpeg')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#495E57',
  },
  rowContainer: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Vertically align text and image
    //justifyContent: 'space-between', // Space out items
    margin: 10,
    paddingBottom: 10
  },
  image: {
    resizeMode: 'cover', // Ensure the image scales proportionally
    height: 150,
    width: 150,
    borderRadius : 25
  },
  headerText: {
    fontSize: 40,
    color: '#F4CE14',
    marginTop: 10,
    marginLeft: 10,
    fontFamily: 'MarkaziText-Regular',
  },
  subHeaderText: {
    fontSize: 30,
    color: 'white',
    marginLeft: 10,
  },
  regularText: {
    fontSize: 18,
    color: 'white',
    width: '60%',
    paddingRight : 10,
    paddingBottom : 10,
  },
});