import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import các component tùy chỉnh
import BottomNavigationBar from "../components/BottomNavigationBar";
import SearchProductComponent from "../components/SearchProductComponent";
import ProductItem from "../components/ProductItem";

// Định nghĩa các hằng số cho màu sắc và kích thước
const COLORS = {
  white: "#fff",
  black: "#1A1A1A",
  darkGray: "#333",
  gray: "#A0A0A0",
  primary: "#6B48FF",
  secondary: "#E6E6FA",
};

const SIZES = {
  icon: 45,
  fontLarge: 20,
  fontMedium: 16,
  fontSmall: 14,
  padding: 16,
  borderRadius: 12,
};

// Định nghĩa type cho Brand và Product
type Brand = {
  _id: string;
  brand_name: string;
  logo: string;
};

type Product = {
  _id: string;
  name: string;
  price: number;
  images: string[];
};

// Component: SectionHeader
const SectionHeader = ({
  title,
  navigation,
}: {
  title: string;
  navigation: any;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductScreen", { query: title })}
    >
      <Text style={styles.seeAll}>See All</Text>
    </TouchableOpacity>
  </View>
);

// Component chính: HomeScreen
const HomeScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const [user, setUser] = useState<any>(null); // Lưu thông tin user từ AsyncStorage
  const [brands, setBrands] = useState<Brand[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true); // Trạng thái loading

  // Lấy dữ liệu user từ AsyncStorage khi component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Lấy user từ route.params nếu có, nếu không thì từ AsyncStorage
        const userFromParams = route.params?.user;
        if (userFromParams) {
          setUser(userFromParams);
        } else {
          const storedUser = await AsyncStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
        // Fetch dữ liệu khác
        await fetchData();
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [route.params?.user]); // Theo dõi route.params.user để cập nhật nếu có thay đổi

  const fetchData = async () => {
    try {
      const [brandsRes, topSellingRes, newProductsRes] = await Promise.all([
        axios.get("http://10.0.2.2:5001/brands"),
        axios.get("http://10.0.2.2:5001/products/top-selling"),
        axios.get("http://10.0.2.2:5001/products/new"),
      ]);
      setBrands(brandsRes.data);
      setTopSellingProducts(topSellingRes.data);
      setNewProducts(newProductsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Xử lý khi nhấn vào sản phẩm
  const handleProductPress = (productId: string) => {
    navigation.navigate("DetailProduct", { productId });
  };

  // Xử lý toggle favorite
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

  // Component: Header
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.navigate("OrderDetailScreen")}
      >
        <Image
          source={
            user?.avatar
              ? { uri: user.avatar }
              : require("../assets/images/avatar.jpeg")
          }
          style={styles.avatar}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
        <View style={styles.cartIconContainer}>
          <Ionicons name="cart-outline" size={24} color={COLORS.white} />
        </View>
      </TouchableOpacity>
    </View>
  );

  // Component: Categories (Danh sách thương hiệu)
  const Categories = () => (
    <View style={styles.categoryListContainer}>
      <FlatList
        data={brands}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() =>
              navigation.navigate("CategoryScreen", { brandId: item._id })
            }
          >
            <Image
              source={{ uri: item.logo }}
              style={styles.categoryImage}
              resizeMode="contain"
            />
            <Text style={styles.categoryText}>{item.brand_name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.scrollViewContent}
      />
    </View>
  );

  // Component: Product List (Danh sách sản phẩm)
  const ProductList = ({ title, data }: { title: string; data: Product[] }) => (
    <View>
      <SectionHeader title={title} navigation={navigation} />
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            isFavorite={favorites.has(item._id)}
            onPress={handleProductPress}
            onToggleFavorite={handleToggleFavorite}
            userId={user?._id || "default-user-id"} // Sử dụng user._id từ AsyncStorage
          />
        )}
        contentContainerStyle={styles.productList}
      />
    </View>
  );

  // Render giao diện chính
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text>User ID: {user?._id || "Chưa đăng nhập"}</Text>
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            <SearchProductComponent navigation={navigation} />
            <SectionHeader title="Categories" navigation={navigation} />
            <Categories />
            <ProductList title="Top Selling" data={topSellingProducts} />
            <ProductList title="New Arrivals" data={newProducts} />
          </>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      />
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

// Styles (giữ nguyên như code gốc)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: SIZES.icon,
    height: SIZES.icon,
    borderRadius: SIZES.borderRadius + 10,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  cartIconContainer: {
    width: SIZES.icon,
    height: SIZES.icon,
    borderRadius: SIZES.borderRadius + 10,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.black,
  },
  seeAll: {
    fontSize: SIZES.fontMedium,
    color: COLORS.gray,
    fontWeight: "500",
  },
  categoryListContainer: {
    marginVertical: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginHorizontal: 8,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
    color: COLORS.black,
    textAlign: "center",
  },
  productList: {
    paddingVertical: SIZES.padding,
  },
});

export default HomeScreen;
