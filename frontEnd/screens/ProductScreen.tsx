import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import SearchProductComponent from "../components/SearchProductComponent";
import ProductItem from "../components/ProductItem";

// Định nghĩa type
interface Product {
  _id: string;
  brand_id: string;
  name: string;
  price: number;
  stock: number;
  sold: number;
  description: string;
  colors: {
    _id: string;
    color_name: string;
    color_code: string;
    image: string;
  }[];
  storage_options: {
    _id: string;
    storage: string;
    price: number;
  }[];
  images: string[];
  created_at: string;
  updated_at: string;
}

// Constants
const COLORS = {
  white: "#fff",
  black: "#000",
  gray: "#666",
  lightGray: "#F5F5F5",
  purple: "#8E6CEF",
  darkPurple: "#7B5CFD",
};

const SIZES = {
  padding: 15,
  iconSize: 40,
  fontLarge: 20,
  fontMedium: 16,
  fontSmall: 14,
  borderRadius: 20,
};

// Component
const ProductScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { query, userId = "default-user-id" } = route.params || {}; // userId mặc định nếu không truyền
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);

  // Fetch products based on query
  useEffect(() => {
    if (query) {
      fetchProducts();
    }
  }, [query]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>(
        `http://10.0.2.2:5001/products/name/${query.trim()}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle product selection
  const handleProductPress = (productId: string) => {
    setSelectedProduct(productId);
    navigation.navigate("DetailProduct", { productId });
  };

  // Toggle favorite
  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  // Sort products
  const sortProducts = (
    criteria: "priceLowToHigh" | "priceHighToLow" | "newest" | "mostPopular"
  ) => {
    const sortedProducts = [...products];
    switch (criteria) {
      case "priceLowToHigh":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "priceHighToLow":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sortedProducts.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "mostPopular":
        sortedProducts.sort((a, b) => b.sold - a.sold);
        break;
    }
    setProducts(sortedProducts);
    setShowPriceFilter(false);
    setShowSortFilter(false);
  };

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="chevron-back"
          size={SIZES.iconSize}
          color={COLORS.black}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.cartButton}>
        <Icon name="cart-outline" size={SIZES.iconSize} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );

  // Render filter buttons
  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <View style={styles.filterWrapper}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            setShowPriceFilter(!showPriceFilter);
            setShowSortFilter(false);
          }}
        >
          <Text style={styles.filterButtonText}>Price</Text>
          <Icon
            name="chevron-down"
            size={SIZES.fontMedium}
            color={COLORS.white}
          />
        </TouchableOpacity>
        {showPriceFilter && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => sortProducts("priceLowToHigh")}
            >
              <Text style={styles.dropdownText}>Low to High</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => sortProducts("priceHighToLow")}
            >
              <Text style={styles.dropdownText}>High to Low</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.filterWrapper}>
        <TouchableOpacity
          style={[styles.filterButton, styles.sortButton]}
          onPress={() => {
            setShowSortFilter(!showSortFilter);
            setShowPriceFilter(false);
          }}
        >
          <Text style={[styles.filterButtonText, styles.sortButtonText]}>
            Sort by
          </Text>
          <Icon
            name="chevron-down"
            size={SIZES.fontMedium}
            color={COLORS.black}
          />
        </TouchableOpacity>
        {showSortFilter && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => sortProducts("newest")}
            >
              <Text style={styles.dropdownText}>Newest</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => sortProducts("mostPopular")}
            >
              <Text style={styles.dropdownText}>Most Popular</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  // Render product list
  const renderProductList = () => (
    <View style={styles.productContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.darkPurple} />
      ) : products.length === 0 ? (
        <Text style={styles.noResultsText}>Không tìm thấy sản phẩm nào.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <ProductItem
              product={{
                _id: item._id,
                name: item.name,
                price: item.price,
                images: item.images,
              }}
              isFavorite={favorites.has(item._id)}
              onPress={handleProductPress}
              onToggleFavorite={handleToggleFavorite}
              isSelected={selectedProduct === item._id}
              userId={userId} // Truyền userId vào ProductItem
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productList}
        />
      )}
    </View>
  );

  // Render bottom navigation
  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      {["home", "notifications", "assignment", "account-circle"].map(
        (iconName, index) => (
          <TouchableOpacity key={index} style={styles.navItem}>
            <MaterialIcon name={iconName} size={30} color={COLORS.black} />
          </TouchableOpacity>
        )
      )}
    </View>
  );

  // Main render
  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.scrollContainer}>
        <SearchProductComponent navigation={navigation} />
        {renderFilterButtons()}
        {renderProductList()}
      </ScrollView>
      {renderBottomNav()}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
    paddingTop: 40,
  },
  backButton: {
    width: SIZES.iconSize,
    height: SIZES.iconSize,
    borderRadius: SIZES.iconSize / 2,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  cartButton: {
    width: SIZES.iconSize,
    height: SIZES.iconSize,
    borderRadius: SIZES.iconSize / 2,
    backgroundColor: COLORS.purple,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 15,
  },
  filterWrapper: {
    position: "relative",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkPurple,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: SIZES.borderRadius,
  },
  sortButton: {
    backgroundColor: COLORS.lightGray,
  },
  filterButtonText: {
    fontSize: SIZES.fontMedium,
    fontWeight: "bold",
    color: COLORS.white,
    marginRight: 8,
  },
  sortButtonText: {
    color: COLORS.black,
  },
  dropdown: {
    position: "absolute",
    top: 45,
    left: 0,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  dropdownText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.black,
  },
  productContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  productList: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  noResultsText: {
    textAlign: "center",
    fontSize: SIZES.fontLarge,
    color: COLORS.gray,
    marginTop: 20,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  navItem: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductScreen;
