import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

const CategoriesScreen = ({ navigation }: { navigation: any }) => {
  type Brand = {
    _id: string;
    brand_name: string;
    logo: string;
  };
  const [brands, setBrands] = useState<Brand[]>([]);

  // Hàm lấy dữ liệu từ backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // Thay URL này bằng endpoint thực tế của backend của bạn
        const response = await axios.get("http://10.0.2.2:5001/brands"); // Ví dụ cho Android Emulator
        setBrands(response.data); // Cập nhật state với dữ liệu từ backend
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands(); // Gọi hàm khi component mount
  }, []); // Mảng rỗng để chỉ chạy 1 lần khi mount

  // Hàm xử lý khi nhấn vào một thương hiệu
  const handleCategoryPress = (brand: any) => {
    console.log("Category pressed:", brand);
    navigation.navigate("ProductScreen", { brand }); // Truyền thông tin thương hiệu sang ProductScreen
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => navigation.navigate("HomePage")}
      >
        <Ionicons name="chevron-back" size={40} color="black" />
      </TouchableOpacity>
      <View style={styles.header}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search products..."
            style={styles.searchInput}
          />
        </View>
      </View>
      <Text style={styles.headerTitle}>Shop by Categories</Text>
      <View style={styles.categoryContainer}>
        {brands.map((brand, index) => (
          <TouchableOpacity
            style={styles.categoryItem}
            key={index} // Nếu backend trả về _id, bạn có thể dùng brand._id thay index
            onPress={() => handleCategoryPress(brand)}
          >
            <Image
              source={{ uri: brand.logo }} // Giả sử backend trả về URL logo
              style={styles.categoryLogo}
            />
            <Text style={styles.categoryText}>{brand.brand_name}</Text>{" "}
            {/* Điều chỉnh tên trường theo dữ liệu backend */}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  icon: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: "#F5F5F5",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 60,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 20,
    paddingHorizontal: 20,
    color: "#333",
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  categoryLogo: {
    width: 50,
    height: 50,
    marginRight: 15,
    marginLeft: 20,
    borderRadius: 25, // Để logo tròn
  },
  categoryText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginLeft: 20,
  },
});

export default CategoriesScreen;
