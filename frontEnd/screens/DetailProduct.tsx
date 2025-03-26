import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

// Định nghĩa types cho các component khác không thay đổi
type DetailProductScreenNavigationProp = StackNavigationProp<ReactNavigation.RootParamList, 'DetailProduct'>;
type DetailProductScreenRouteProp = RouteProp<ReactNavigation.RootParamList, 'DetailProduct'>;

interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  daysAgo: number;
}

interface StorageOption {
  _id: string;
  storage: string;
  price: number;
}

interface ColorOption {
  _id: string;
  color_name: string;
  color_code: string;
  image: string;
}

interface Product {
  _id: string;
  brand_id: string;
  name: string;
  price: number;
  stock: number;
  sold: number;
  description: string;
  colors: ColorOption[];
  storage_options: StorageOption[];
  images: string[];
  specs: {
    display: string;
    chipset: string;
    ram: string;
    battery: string;
    camera: string;
    os: string;
    network: string;
  };
  reviews: Review[];
  created_at: string;
  updated_at: string;
}

interface DetailProductProps {
  navigation: DetailProductScreenNavigationProp;
  route: DetailProductScreenRouteProp;
}

// Constants
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLORS = {
  primary: "#8E6CEF",
  white: "#fff",
  black: "#000",
  gray: "#ccc",
  green: "#00cc00",
  blue: "#0000ff",
};
const SIZES = {
  padding: 16,
  borderRadius: 30,
  fontLarge: 32,
  fontMedium: 18,
  fontSmall: 14,
};

const DetailProduct: React.FC<DetailProductProps> = ({ navigation, route }) => {
  const { productId } = route.params; // Lấy productId từ params
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) throw new Error("No product ID provided");
        const response = await axios.get<Product>(
          `http://10.0.2.2:5001/products/${productId}`
        );
        setProduct(response.data);
        setSelectedStorage(response.data.storage_options[0]);
        setSelectedColor(response.data.colors[0]);
      } catch (error) {
        console.error("Error fetching product:", error);
        Alert.alert("Error", "Failed to load product details");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigation]);

  // Image fade animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Handle quantity change
  const handleQuantityChange = (value: string) => {
    const parsedValue = parseInt(value);
    if (
      !isNaN(parsedValue) &&
      parsedValue > 0 &&
      parsedValue <= (product?.stock || Infinity)
    ) {
      setQuantity(parsedValue);
    }
  };

  // Handle image scroll
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
    );
    setCurrentImageIndex(newIndex);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        Alert.alert("Error", "Please log in to add items to cart");
        navigation.navigate("Login");
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id;

      if (!selectedStorage || !selectedColor) {
        Alert.alert("Error", "Please select storage and color");
        return;
      }

      // Kiểm tra số lượng tồn kho
      if (product && quantity > product.stock) {
        Alert.alert(
          "Error", 
          `Cannot add more than available stock. Available: ${product.stock}, Requested: ${quantity}`
        );
        return;
      }

      const response = await axios.post("http://10.0.2.2:5001/carts/add", {
        user_id: userId,
        product_id: productId,
        quantity,
        selected_storage: selectedStorage.storage,
        selected_color: selectedColor.color_name,
      });

      Alert.alert("Success", "Product added to cart!");
      navigation.navigate("CartScreen", { userId });
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        // Hiển thị lỗi từ server (ví dụ: vượt quá số lượng trong kho)
        Alert.alert(
          "Error",
          error.response.data.message || "Failed to add product to cart"
        );
      } else if (axios.isAxiosError(error) && error.response?.status === 404) {
        Alert.alert(
          "Error",
          "Cart endpoint not found. Please check your server."
        );
      } else {
        Alert.alert("Error", "Failed to add product to cart");
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
      </View>
    );
  }

  // No product state
  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No product data available</Text>
      </View>
    );
  }

  // Render image slider
  const renderImageSlider = () => (
    <>
      <FlatList
        ref={flatListRef}
        data={product.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Animated.Image
            source={{ uri: item }}
            style={[styles.productImage, { opacity: fadeAnim }]}
            resizeMode="contain"
          />
        )}
        snapToInterval={SCREEN_WIDTH}
        onScroll={handleScroll}
        decelerationRate="fast"
      />
      <View style={styles.indicatorContainer}>
        {product.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentImageIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </>
  );

  // Render color options
  const renderColorOptions = () => (
    <View style={styles.colorSection}>
      {product.colors.map((color) => (
        <TouchableOpacity
          key={color._id}
          style={[
            styles.colorOption,
            selectedColor?._id === color._id && styles.selectedColor,
          ]}
          onPress={() => setSelectedColor(color)}
        >
          <View
            style={[styles.colorCircle, { backgroundColor: color.color_code }]}
          />
          <Text style={styles.colorText}>{color.color_name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render storage options
  const renderStorageOptions = () => (
    <View style={styles.storageSection}>
      {product.storage_options.map((storage) => (
        <TouchableOpacity
          key={storage._id}
          style={[
            styles.storageOption,
            selectedStorage?._id === storage._id && styles.selectedStorage,
          ]}
          onPress={() => setSelectedStorage(storage)}
        >
          <Text style={styles.storageText}>{storage.storage}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render quantity selector
  const renderQuantitySelector = () => (
    <View style={styles.quantitySection}>
      <View style={styles.quantityHeader}>
        <Text style={styles.quantityLabel}>Quantity</Text>
        <Text style={styles.stockInfo}>
          {product.stock > 0 
            ? `${product.stock} in stock` 
            : "Out of stock"}
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={[
            styles.quantityButton,
            quantity <= 1 && styles.disabledButton
          ]}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.quantityInput}
          value={quantity.toString()}
          onChangeText={handleQuantityChange}
          keyboardType="numeric"
          maxLength={3}
        />
        <TouchableOpacity
          style={[
            styles.quantityButton,
            quantity >= product.stock && styles.disabledButton
          ]}
          onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
          disabled={quantity >= product.stock}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Main render
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("HomePage")}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={async () => {
            const userString = await AsyncStorage.getItem("user");
            const user = userString ? JSON.parse(userString) : null;
            navigation.navigate("CartScreen", { userId: user?._id });
          }}
        >
          <Ionicons name="cart-outline" size={35} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImageSlider()}
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          {selectedStorage && (
            <Text style={styles.price}>
              ${selectedStorage.price.toLocaleString()}
            </Text>
          )}

          {/* Colors */}
          <Text style={styles.sectionTitle}>Colors Available</Text>
          {renderColorOptions()}

          {/* Storage */}
          <Text style={styles.sectionTitle}>Storage</Text>
          {renderStorageOptions()}

          {/* Quantity */}
          {renderQuantitySelector()}

          {/* Description */}
          <Text style={styles.sectionTitle}>Product Information</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Specifications */}
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specsContainer}>
            {Object.entries(product.specs).map(([key, value]) => (
              <Text key={key} style={styles.specText}>
                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
              </Text>
            ))}
          </View>

          {/* Reviews */}
          <Text style={styles.sectionTitle}>Reviews</Text>
          <FlatList
            data={product.reviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reviewContainer}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewName}>{item.name}</Text>
                  <Text style={styles.reviewRating}>
                    {"★".repeat(item.rating)}
                  </Text>
                  <Text style={styles.reviewComment}>{item.comment}</Text>
                  <Text style={styles.reviewDays}>{item.daysAgo} days ago</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={<Text>No reviews yet</Text>}
          />
        </View>
      </ScrollView>

      {/* Add to Cart */}
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={handleAddToCart}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: SIZES.fontMedium,
    textAlign: "center",
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
  },
  cartButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 40,

  },
  productImage: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: COLORS.primary,
    width: 12,
  },
  detailsContainer: {
    padding: SIZES.padding,
  },
  productName: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
  },
  price: {
    fontSize: SIZES.fontMedium,
    fontWeight: "bold",
    color: COLORS.green,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 16,
  },
  colorSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginVertical: 8,
  },
  colorOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    minWidth: 100,
  },
  selectedColor: {
    borderColor: COLORS.primary,
    backgroundColor: "#e6f0fa",
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  colorText: {
    fontSize: SIZES.fontSmall,
  },
  storageSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginVertical: 8,
  },
  storageOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  selectedStorage: {
    borderColor: COLORS.primary,
    backgroundColor: "#e6f0fa",
  },
  storageText: {
    fontSize: SIZES.fontSmall,
  },
  quantitySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  quantityLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "500",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  quantityButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityInput: {
    width: 50,
    textAlign: "center",
    fontSize: SIZES.fontMedium,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingVertical: 4,
  },
  description: {
    fontSize: SIZES.fontSmall,
    lineHeight: 20,
    marginVertical: 8,
  },
  specsContainer: {
    marginVertical: 8,
  },
  specText: {
    fontSize: SIZES.fontSmall,
    marginBottom: 4,
  },
  reviewContainer: {
    flexDirection: "row",
    marginVertical: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewName: {
    fontSize: SIZES.fontMedium,
    fontWeight: "bold",
  },
  reviewRating: {
    fontSize: SIZES.fontSmall,
    color: "#FFD700",
    marginVertical: 4,
  },
  reviewComment: {
    fontSize: SIZES.fontSmall,
  },
  reviewDays: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    margin: SIZES.padding,
    borderRadius: SIZES.borderRadius,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: SIZES.fontMedium,
    fontWeight: "bold",
    textAlign: "center",
  },
  quantityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stockInfo: {
    fontSize: SIZES.fontSmall,
    color: COLORS.gray,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
});

export default DetailProduct;
