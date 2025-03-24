import React from "react";
import { useState } from "react";
import BottomNavigationBar from "../components/BottomNavigationBar";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon1 from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Ionicons";
import { AirbnbRating } from "react-native-elements";

const WishListScreen = ({ navigation }: { navigation: any }) => {
  const products = [
    {
      id: "1",
      name: "Samsung S25 Ultra",
      price: "$999",
      image: require("../assets/images/iphone16.jpeg"),
      rating: 5,
      reviews: 2500,
    },
    {
      id: "2",
      name: "iPhone 16 Pro Max",
      price: "$1199",
      image: require("../assets/images/iphone16.jpeg"),
      rating: 5,
      reviews: 2500,
    },
    {
      id: "3",
      name: "iPhone 16 Pro Max",
      price: "$1199",
      image: require("../assets/images/iphone16.jpeg"),
      rating: 5,
      reviews: 2500,
    },
    {
      id: "4",
      name: "iPhone 16 Pro Max",
      price: "$1199",
      image: require("../assets/images/email-sent.png"),
      rating: 5,
      reviews: 2500,
    },
    {
      id: "5",
      name: "iPhone 16 Pro Max",
      price: "$1199",
      image: require("../assets/images/email-sent.png"),
      rating: 5,
      reviews: 2500,
    },
    {
      id: "6",
      name: "iPhone 16 Pro Max",
      price: "$1199",
      image: require("../assets/images/email-sent.png"),
      rating: 5,
      reviews: 2500,
    },
    {
      id: "7",
      name: "iPhone 16 Pro Max",
      price: "$1199",
      image: require("../assets/images/email-sent.png"),
      rating: 5,
      reviews: 2500,
    },
  ];
  const [isFavorite, setIsFavorite] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleProductPress = (productId: any) => {
    setSelectedProduct(productId);
    navigation.navigate("DetailProduct", { productId });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          <Ionicons name="chevron-back" size={40} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {/* Search Bar */}
        <View style={styles.headerSearch}>
          <View style={styles.searchContainer}>
            <Icon
              name="search"
              size={25}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search products..."
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Products */}
        <View style={styles.productList}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 10,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.productItem2,
                  selectedProduct === item.id && styles.selectedProduct,
                ]}
                onPress={() => handleProductPress(item.id)}
              >
                <TouchableOpacity
                  style={styles.wishlistButton}
                  onPress={() => setIsFavorite(!isFavorite)}
                >
                  <Icon
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={24}
                    color={isFavorite ? "red" : "gray"}
                  />
                </TouchableOpacity>
                <Image source={item.image} style={styles.productImage} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
                <View style={styles.ratingContainer}>
                  <AirbnbRating
                    count={5}
                    defaultRating={item.rating}
                    size={15}
                    showRating={false}
                    isDisabled
                  />
                  <Text style={styles.reviewText}>
                    <Text style={{ fontWeight: "bold" }}>{item.rating}</Text> (
                    {item.reviews} reviews)
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  header: {
    flex: 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 13,
  },
  icon: {
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
  cartIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#8E6CEF",
    justifyContent: "center",
    alignItems: "center",
  },
  headerSearch: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
    gap: 30,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  priceButton: {
    backgroundColor: "#7B5CFD",
  },
  sortButton: {
    backgroundColor: "#F5F5F5",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 6,
  },
  priceText: {
    color: "#fff",
  },
  sortText: {
    color: "#000",
  },
  productList: {
    flex: 1,
    flexDirection: "column",
  },
  productItem2: {
    marginTop: 20,
    width: "48%",
    height: 400,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedProduct: {
    borderColor: "#7B5CFD",
    borderWidth: 2,
  },
  wishlistButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  productImage: {
    width: "100%",
    height: 250,
    borderRadius: 5,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginLeft: 10,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginLeft: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 9,
    color: "#666",
    marginLeft: 5,
  },
  containerIcon: {
    flex: 0.05,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WishListScreen;
