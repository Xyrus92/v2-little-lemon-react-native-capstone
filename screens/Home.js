import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import Header from '../components/Header';
import Banner from '../components/Banner';
import CategoryList from '../components/CategoryList';
import Search from '../components/Search';

const MENU_API = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const IMAGE_BASE_URL = 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/';

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(MENU_API);
        const data = await response.json();
        const transformedData = data.menu.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: `${IMAGE_BASE_URL}${item.image}?raw=true`,
          category: item.category,
        }));
        setMenuItems(transformedData);
        setFilteredItems(transformedData); // Show all items by default
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Handle category and search query filtering
  const applyFilters = (categories, query) => {
    let filtered = menuItems;

    // Apply category filter
    if (categories.length > 0) {
      filtered = filtered.filter((item) => categories.includes(item.category));
    }

    // Apply search query filter
    if (query) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  // Handle category selection
  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
    applyFilters(categories, searchQuery);
  };

  // Handle search query updates
  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
    applyFilters(selectedCategories, query);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
    </View>
  );

  return (
    <>
      <Header />
      <Banner />
      <Search onSearch={handleSearchQueryChange} />
      <CategoryList onSelectCategory={handleCategorySelect} />
      <View style={styles.container}>
        {loading ? (
          <Text style={styles.loadingText}>Loading menu...</Text>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFEE',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495E57',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495E57',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
});