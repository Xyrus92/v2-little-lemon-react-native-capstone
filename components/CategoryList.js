import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

export default function CategoryList({ onSelectCategory }) {
  const [selected, setSelected] = useState([]);

  const categories = ['starters', 'mains', 'desserts', 'drinks', 'specials'];

  const toggleCategory = (category) => {
    const newSelected = selected.includes(category)
      ? selected.filter((item) => item !== category)
      : [...selected, category];
    setSelected(newSelected);
    onSelectCategory(newSelected); // Notify parent component
  };

const renderCategory = ({ item: category }) => {
  // Capitalize the first letter of the category
  const capitalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <TouchableOpacity
      onPress={() => toggleCategory(category)}
      style={[
        styles.categoryButton,
        selected.includes(category) && styles.selectedCategory,
      ]}
    >
      <Text
        style={[
          styles.categoryText,
          selected.includes(category) && styles.categoryTextSelected,
        ]}
      >
        {capitalizedCategory}
      </Text>
    </TouchableOpacity>
  );
};

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        horizontal
        renderItem={renderCategory}
        contentContainerStyle={styles.listContent}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: '#495E57',
  },
  categoryText: {
    fontSize: 16,
    color: '#495E57',
  },
  categoryTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});