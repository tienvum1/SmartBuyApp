import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SearchProductComponent = ({ navigation }: { navigation: any }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập tên sản phẩm để tìm kiếm.");
      return;
    }

    // Chuyển sang trang ProductScreen với query
    setLoading(true);
    navigation.navigate("ProductScreen", { query: searchQuery.trim() });
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="🔍 Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="search-outline" size={10} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#7B5CFD",
    padding: 12,
    borderRadius: 20,
    marginLeft: 6,
  },
});

export default SearchProductComponent;
