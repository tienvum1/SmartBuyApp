import React, { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StatusBar,
  Dimensions,
  Image,
  TextInput,
} from "react-native";
import SearchProductComponent from "../components/SearchProductComponent";
import ProductItem from "../components/ProductItem";
import BottomNavigationBar from "../components/BottomNavigationBar";

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
  blue: "#4A90E2",
  background: "#F9F9F9",
  shadowColor: "rgba(0, 0, 0, 0.05)",
};

const SIZES = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
  padding: 15,
  iconSize: 26,
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
  const { query, brandId, brandName, userId = "default-user-id", productType } = route.params || {};
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>("Products");
  const [filterVisible, setFilterVisible] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [isPriceRangeActive, setIsPriceRangeActive] = useState<boolean>(false);
  const [showPriceFilter, setShowPriceFilter] = useState<boolean>(false);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);

  // Fetch products based on query or brandId
  useEffect(() => {
    console.log("ProductScreen - Current userId:", userId);
    
    if (productType) {
      fetchProductsByType();
    } else if (query) {
      fetchProductsByQuery();
    } else if (brandId) {
      fetchProductsByBrand();
    }
    
    // Fetch user's wishlist
    if (userId && userId !== "default-user-id") {
      fetchUserWishlist();
    }
  }, [query, brandId, userId, productType]);

  // Cập nhật tiêu đề trang
  useEffect(() => {
    if (productType === 'top-selling') {
      setPageTitle('All Products (Top Selling)');
    } else if (productType === 'new-arrivals') {
      setPageTitle('All Products (New Arrivals)');
    } else if (brandName) {
      setPageTitle(brandName);
    } else if (query) {
      setPageTitle(`Search: ${query}`);
    } else {
      setPageTitle("Products");
    }
  }, [brandName, query, productType]);

  const fetchProductsByQuery = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>(
        `http://10.0.2.2:5001/products/name/${query.trim()}`
      );
      setOriginalProducts(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setOriginalProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByBrand = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>(
        `http://10.0.2.2:5001/products/brand/${brandId}`
      );
      setOriginalProducts(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products by brand:", error);
      setProducts([]);
      setOriginalProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's wishlist to highlight favorites
  const fetchUserWishlist = async () => {
    if (!userId || userId === "default-user-id") {
      console.log("Skipping wishlist fetch: No valid userId");
      return; // Không fetch nếu người dùng chưa đăng nhập
    }
    
    try {
      console.log(`Fetching wishlist for user: ${userId}`);
      const response = await axios.get(`http://10.0.2.2:5001/wishlists/user/${userId}`);
      
      if (!response.data) {
        console.log("No wishlist data returned from API");
        return;
      }
      
      if (response.data && response.data.products) {
        // Tạo set mới từ danh sách sản phẩm yêu thích với chỉ định kiểu Set<string> rõ ràng
        const wishlistProductIds: Set<string> = new Set(
          response.data.products.map((item: any) => {
            // Xử lý cả hai trường hợp: item.product_id là object hoặc string
            const productId = typeof item.product_id === 'object' 
              ? item.product_id._id 
              : item.product_id;
            // Đảm bảo rằng productId là string
            return String(productId);
          })
        );
        
        console.log(`Found ${wishlistProductIds.size} products in wishlist for user ${userId}`);
        setFavorites(wishlistProductIds);
      } else {
        console.log("Wishlist found but no products in it");
        setFavorites(new Set());
      }
    } catch (error) {
      console.error("Error fetching user wishlist:", error);
      // Nếu API không hoạt động, vẫn giữ nguyên trạng thái favorites hiện tại
    }
  };

  // Fetch products by type (top-selling or new)
  const fetchProductsByType = async () => {
    try {
      setLoading(true);
      
      // Lấy tất cả sản phẩm từ database thay vì chỉ lấy theo endpoint cụ thể
      const response = await axios.get<Product[]>('http://10.0.2.2:5001/products');
      let sortedProducts = [...response.data];

      // Lưu danh sách sản phẩm gốc để sử dụng khi lọc
      setOriginalProducts(sortedProducts);

      // Sắp xếp sản phẩm dựa trên tiêu chí
      if (productType === 'top-selling') {
        // Sắp xếp theo số lượng bán từ cao xuống thấp
        sortedProducts.sort((a, b) => b.sold - a.sold);
        setActiveFilter("Most Popular");
      } else if (productType === 'new-arrivals') {
        // Sắp xếp theo thời gian tạo mới nhất
        sortedProducts.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setActiveFilter("Newest");
      }
      
      setProducts(sortedProducts);
    } catch (error) {
      console.error(`Error fetching products:`, error);
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
  const handleToggleFavorite = async (productId: string) => {
    // Kiểm tra nếu người dùng chưa đăng nhập
    if (!userId || userId === "default-user-id") {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    // Xác định trạng thái yêu thích hiện tại trước khi cập nhật UI
    const isFavorite = favorites.has(productId);
    
    // Cập nhật UI trước để có phản hồi nhanh
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });

    // Xác định URL tương ứng với trạng thái yêu thích hiện tại
    const url = isFavorite
      ? "http://10.0.2.2:5001/wishlists/remove"  // Nếu đã là favorite thì gọi API remove
      : "http://10.0.2.2:5001/wishlists/add";    // Nếu chưa là favorite thì gọi API add

    try {
      console.log(`Calling API: ${url}, productId: ${productId}, userId: ${userId}, isFavorite: ${isFavorite}`);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("API error:", responseData.message);
        
        // Khôi phục trạng thái UI nếu thất bại
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          if (isFavorite) {
            newFavorites.add(productId); // Khôi phục lại trạng thái cũ
          } else {
            newFavorites.delete(productId); // Khôi phục lại trạng thái cũ
          }
          return newFavorites;
        });
        
        Alert.alert("Lỗi", responseData.message || "Không thể cập nhật danh sách yêu thích");
      } else {
        console.log("API success:", responseData.message);
        // Làm mới danh sách yêu thích từ server sau khi cập nhật thành công
        if (userId && userId !== "default-user-id") {
          fetchUserWishlist();
        }
      }
    } catch (error) {
      console.error("Network Error:", error);
      
      // Khôi phục trạng thái UI nếu có lỗi mạng
      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        if (isFavorite) {
          newFavorites.add(productId); // Khôi phục lại trạng thái cũ
        } else {
          newFavorites.delete(productId); // Khôi phục lại trạng thái cũ
        }
        return newFavorites;
      });
      
      Alert.alert("Lỗi", "Có lỗi xảy ra khi kết nối đến server");
    }
  };

  // Sort products
  const sortProducts = (
    criteria: "priceLowToHigh" | "priceHighToLow" | "newest" | "mostPopular"
  ) => {
    // Quyết định danh sách sản phẩm để sắp xếp
    // Nếu bộ lọc giá đang áp dụng, tiếp tục sắp xếp trên kết quả đã lọc
    // Nếu không, sắp xếp trên danh sách gốc và áp dụng bộ lọc giá sau nếu cần
    let productsToSort = isPriceRangeActive ? [...products] : [...originalProducts];
    
    // Thực hiện sắp xếp
    switch (criteria) {
      case "priceLowToHigh":
        productsToSort.sort((a, b) => a.price - b.price);
        setActiveFilter("Price: Low to High");
        break;
      case "priceHighToLow":
        productsToSort.sort((a, b) => b.price - a.price);
        setActiveFilter("Price: High to Low");
        break;
      case "newest":
        productsToSort.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setActiveFilter("Newest");
        break;
      case "mostPopular":
        productsToSort.sort((a, b) => b.sold - a.sold);
        setActiveFilter("Most Popular");
        break;
    }
    
    // Nếu bộ lọc giá KHÔNG được áp dụng, cập nhật danh sách sản phẩm trực tiếp
    if (!isPriceRangeActive) {
      setProducts(productsToSort);
    } else {
      // Nếu bộ lọc giá đã được áp dụng, chỉ cập nhật thứ tự của những sản phẩm đã lọc
      setProducts(productsToSort);
    }
    
    setFilterVisible(false);
  };

  // Hàm định dạng giá
  const formatPrice = (price: number | string): string => {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Cập nhật hàm applyPriceFilter để hỗ trợ định dạng giá
  const applyPriceFilter = () => {
    // Chuyển đổi giá trị nhập vào từ định dạng có dấu phẩy thành số
    const parsePrice = (price: string): number => {
      return price ? parseInt(price.replace(/,/g, '')) : 0;
    };

    const min = parsePrice(minPrice);
    const max = maxPrice ? parsePrice(maxPrice) : Number.MAX_SAFE_INTEGER;

    if (min > max && max !== Number.MAX_SAFE_INTEGER) {
      Alert.alert(
        "Lỗi",
        "Giá tối thiểu không thể lớn hơn giá tối đa"
      );
      return;
    }

    // Lọc sản phẩm theo khoảng giá
    const filteredProducts = originalProducts.filter(
      product => product.price >= min && product.price <= max
    );

    // Áp dụng bộ lọc và cập nhật trạng thái
    setProducts(filteredProducts);
    setIsPriceRangeActive(true);
    setShowPriceFilter(false);
    setFilterVisible(false);
  };

  // Thêm hàm reset bộ lọc giá
  const resetPriceFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setIsPriceRangeActive(false);
    
    // Khôi phục lại danh sách sản phẩm ban đầu
    if (originalProducts.length > 0) {
      setProducts(originalProducts);
      
      // Nếu có sắp xếp đang áp dụng, áp dụng lại sắp xếp đó
      if (activeFilter) {
        let sortedProducts = [...originalProducts];
        
        switch(activeFilter) {
          case "Price: Low to High":
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
          case "Price: High to Low":
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
          case "Newest":
            sortedProducts.sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            break;
          case "Most Popular":
            sortedProducts.sort((a, b) => b.sold - a.sold);
            break;
        }
        
        setProducts(sortedProducts);
      }
    }
  };

  // Thêm hàm resetAllFilters
  const resetAllFilters = () => {
    // Đặt lại tất cả các trạng thái bộ lọc
    setMinPrice('');
    setMaxPrice('');
    setIsPriceRangeActive(false);
    setActiveFilter(null);
    
    // Khôi phục danh sách sản phẩm gốc
    if (originalProducts.length > 0) {
      setProducts(originalProducts);
    }
    
    // Đóng bảng điều khiển bộ lọc
    setFilterVisible(false);
  };

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={SIZES.iconSize} color={COLORS.black} />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>{pageTitle}</Text>
          {products.length > 0 && (
            <View style={styles.resultInfoContainer}>
              <Text style={styles.resultCount}>
                {productType ? `Showing all ${products.length} products` : `${products.length} products`}
              </Text>
              {isPriceRangeActive && (
                <View style={styles.appliedFilterContainer}>
                  <MaterialCommunityIcons name="currency-usd" size={12} color={COLORS.darkPurple} />
                  <Text style={styles.appliedFilterText}>
                    {formatPrice(minPrice || '0')} - {formatPrice(maxPrice) || 'Max'} VND
                  </Text>
                </View>
              )}
              {activeFilter && (
                <View style={styles.appliedFilterContainer}>
                  <MaterialCommunityIcons name="sort-variant" size={12} color={COLORS.darkPurple} />
                  <Text style={styles.appliedFilterText}>
                    {activeFilter}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate("WishlistScreen", { userId })}
          >
            <Ionicons name="heart-outline" size={SIZES.iconSize - 2} color={COLORS.black} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate("CartScreen")}
          >
            <Ionicons name="cart-outline" size={SIZES.iconSize - 2} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render filter options
  const renderFilterOptions = () => (
    <View style={styles.filterSection}>
      <TouchableOpacity 
        style={styles.filterToggle}
        onPress={() => setFilterVisible(!filterVisible)}
      >
        <MaterialCommunityIcons name="filter-variant" size={20} color={COLORS.darkPurple} />
        <View style={styles.filterTextContainer}>
          <Text style={styles.filterToggleText}>
            {activeFilter ? `Sorted by: ${activeFilter}` : "Filter & Sort"}
          </Text>
          {isPriceRangeActive && (
            <Text style={styles.filterHintText}>
              Price: {formatPrice(minPrice || '0')} - {formatPrice(maxPrice) || 'Max'} VND
            </Text>
          )}
          {productType && !isPriceRangeActive && (
            <Text style={styles.filterHintText}>Tap to change sorting</Text>
          )}
        </View>
        <Ionicons 
          name={filterVisible ? "chevron-up" : "chevron-down"} 
          size={18} 
          color={COLORS.darkPurple} 
        />
      </TouchableOpacity>
      
      {filterVisible && (
        <View style={styles.filterOptionsContainer}>
          {/* Price Range Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupTitle}>Price Range</Text>
            
            <View style={styles.priceInputContainer}>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.priceInputLabel}>Min (VND)</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="0"
                  value={minPrice}
                  onChangeText={(text) => {
                    // Chỉ chấp nhận số
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setMinPrice(numericValue ? formatPrice(numericValue) : '');
                  }}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.priceRangeDivider} />
              
              <View style={styles.priceInputWrapper}>
                <Text style={styles.priceInputLabel}>Max (VND)</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  value={maxPrice}
                  onChangeText={(text) => {
                    // Chỉ chấp nhận số
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setMaxPrice(numericValue ? formatPrice(numericValue) : '');
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.priceFilterButtons}>
              <TouchableOpacity
                style={[styles.priceFilterButton, styles.priceFilterResetButton]}
                onPress={resetPriceFilter}
              >
                <Text style={styles.priceFilterResetText}>Reset</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.priceFilterButton, styles.priceFilterApplyButton]}
                onPress={applyPriceFilter}
              >
                <Text style={styles.priceFilterApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.filterSeparator} />
          
          {/* Sort Options */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterGroupTitle}>Sort by</Text>
            
            {/* Sort by Price */}
            <Text style={styles.filterSubGroupTitle}>Price</Text>
            <TouchableOpacity
              style={[styles.filterOption, activeFilter === "Price: Low to High" && styles.activeFilterOption]}
              onPress={() => sortProducts("priceLowToHigh")}
            >
              <Text style={[styles.filterOptionText, activeFilter === "Price: Low to High" && styles.activeFilterText]}>
                Low to High
              </Text>
              {activeFilter === "Price: Low to High" && (
                <Ionicons name="checkmark" size={18} color={COLORS.white} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.filterOption, activeFilter === "Price: High to Low" && styles.activeFilterOption]}
              onPress={() => sortProducts("priceHighToLow")}
            >
              <Text style={[styles.filterOptionText, activeFilter === "Price: High to Low" && styles.activeFilterText]}>
                High to Low
              </Text>
              {activeFilter === "Price: High to Low" && (
                <Ionicons name="checkmark" size={18} color={COLORS.white} />
              )}
            </TouchableOpacity>
            
            {/* Sort by Date/Popularity */}
            <Text style={styles.filterSubGroupTitle}>Other</Text>
            <TouchableOpacity
              style={[styles.filterOption, activeFilter === "Newest" && styles.activeFilterOption]}
              onPress={() => sortProducts("newest")}
            >
              <Text style={[styles.filterOptionText, activeFilter === "Newest" && styles.activeFilterText]}>
                Newest First
              </Text>
              {activeFilter === "Newest" && (
                <Ionicons name="checkmark" size={18} color={COLORS.white} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.filterOption, activeFilter === "Most Popular" && styles.activeFilterOption]}
              onPress={() => sortProducts("mostPopular")}
            >
              <Text style={[styles.filterOptionText, activeFilter === "Most Popular" && styles.activeFilterText]}>
                Most Popular
              </Text>
              {activeFilter === "Most Popular" && (
                <Ionicons name="checkmark" size={18} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </View>
          
          {/* Reset All Filters Button */}
          {(isPriceRangeActive || activeFilter) && (
            <TouchableOpacity 
              style={styles.resetAllFiltersButton}
              onPress={resetAllFilters}
            >
              <Text style={styles.resetAllFiltersText}>Reset All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  // Render product list
  const renderProductList = () => (
    <View style={styles.productContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.darkPurple} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="shopping-search" size={120} color={COLORS.darkPurple} style={styles.emptyIcon} />
          <Text style={styles.noResultsText}>Không tìm thấy sản phẩm nào</Text>
          <Text style={styles.noResultsSubText}>
            Vui lòng thử lại với từ khóa khác hoặc danh mục khác
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate("HomeScreen")}
          >
            <Text style={styles.browseButtonText}>Quay về trang chủ</Text>
          </TouchableOpacity>
        </View>
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
              userId={userId || ""}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productList}
        />
      )}
    </View>
  );

  // Main render
  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.mainContent}>
        <SearchProductComponent navigation={navigation} userId={userId} />
        {renderFilterOptions()}
        {renderProductList()}
      </View>
      <BottomNavigationBar navigation={navigation} activeScreen="Search" />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    elevation: 2,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.black,
  },
  resultInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 3,
  },
  resultCount: {
    fontSize: 13,
    color: COLORS.gray,
  },
  appliedFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginLeft: 8,
    marginTop: 2,
    marginBottom: 2,
  },
  appliedFilterText: {
    fontSize: 11,
    color: COLORS.darkPurple,
    fontWeight: "500",
    marginLeft: 3,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.darkPurple,
    justifyContent: "center",
    alignItems: "center",
  },
  filterSection: {
    marginTop: 12,
    marginBottom: 8,
  },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  filterTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  filterToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.darkPurple,
  },
  filterHintText: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
  filterOptionsContainer: {
    backgroundColor: COLORS.white,
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterGroup: {
    marginBottom: 10,
  },
  filterGroupTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 8,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: COLORS.lightGray,
  },
  activeFilterOption: {
    backgroundColor: COLORS.darkPurple,
  },
  filterOptionText: {
    fontSize: 14,
    color: COLORS.black,
  },
  activeFilterText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  productContainer: {
    flex: 1,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.9,
  },
  noResultsText: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.black,
    textAlign: "center",
  },
  noResultsSubText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: COLORS.darkPurple,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  browseButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  productList: {
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginVertical: 8,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  priceInputWrapper: {
    flex: 1,
  },
  priceInputLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  priceInput: {
    height: 38,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  priceRangeDivider: {
    width: 15,
    height: 2,
    backgroundColor: COLORS.gray,
    marginHorizontal: 10,
    alignSelf: 'center',
    marginTop: 15,
  },
  priceFilterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  priceFilterButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceFilterResetButton: {
    backgroundColor: COLORS.lightGray,
    marginRight: 10,
  },
  priceFilterResetText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
  },
  priceFilterApplyButton: {
    backgroundColor: COLORS.darkPurple,
  },
  priceFilterApplyText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
  filterSeparator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 10,
  },
  filterSubGroupTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 6,
    marginTop: 4,
  },
  resetAllFiltersButton: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  resetAllFiltersText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray,
  },
});

export default ProductScreen;
