import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import { AirbnbRating } from "react-native-elements";
import BottomNavigationBar from "../components/BottomNavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating?: number;
  reviews?: number;
}

const WishListScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Tải lại dữ liệu khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("WishListScreen focused - fetching data");
      fetchWishlistData();
      return () => {
        // Cleanup khi màn hình mất focus (nếu cần)
      };
    }, [])
  );

  useEffect(() => {
    fetchWishlistData();
  }, []);

  const fetchWishlistData = async () => {
    try {
      setLoading(true);
      // Lấy thông tin người dùng từ AsyncStorage
      const userString = await AsyncStorage.getItem("user");
      console.log("User string:", userString); // Debug

      if (!userString) {
        Alert.alert(
          "Thông báo",
          "Vui lòng đăng nhập để xem danh sách yêu thích!"
        );
        navigation.navigate("SignInScreen");
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id || user.id;
      console.log("User ID:", userId); // Debug

      if (!userId) {
        Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng!");
        return;
      }

      // Gọi API lấy danh sách yêu thích
      console.log(`Đang gọi API: http://10.0.2.2:5001/wishlists/${userId}`); // Debug
      const response = await axios.get(
        `http://10.0.2.2:5001/wishlists/${userId}`,
        { timeout: 8000 } // Tăng timeout lên 8 giây
      );

      console.log("API response:", JSON.stringify(response.data, null, 2)); // Debug

      // Kiểm tra và xử lý dữ liệu trả về
      if (response.data && response.data.data && response.data.data.products) {
        const apiProducts = response.data.data.products;

        // Kiểm tra xem có sản phẩm nào không
        if (apiProducts.length === 0) {
          console.log("Danh sách wishlist rỗng");
          setWishlistItems([]);
          return;
        }

        // Tạo danh sách sản phẩm từ API
        const products = apiProducts
          .map((item: any) => {
            const product =
              typeof item.product_id === "object" ? item.product_id : item;

            if (!product || !product._id || !product.name) {
              console.log("Dữ liệu sản phẩm không hợp lệ:", product);
              return null;
            }

            return {
              _id: product._id,
              name: product.name,
              price: product.price || 0,
              images: product.images || [],
              rating: product.rating || 5,
              reviews: product.reviews || 100,
            };
          })
          .filter(Boolean); // Lọc bỏ các giá trị null

        console.log("Số lượng sản phẩm sau khi xử lý:", products.length); // Debug
        setWishlistItems(products);
      } else if (response.data && response.data.success === false) {
        console.log("API trả về thất bại:", response.data.message);
        setWishlistItems([]);
      } else {
        console.log("Không tìm thấy dữ liệu sản phẩm trong response");
        setWishlistItems([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      if (axios.isAxiosError(error)) {
        console.log("Status:", error.response?.status);
        console.log("Data:", JSON.stringify(error.response?.data, null, 2));

        // Nếu là lỗi 404 - Không tìm thấy wishlist, chỉ cần hiển thị danh sách trống
        if (error.response?.status === 404) {
          console.log("Người dùng chưa có danh sách yêu thích");
          setWishlistItems([]);
          return; // Thoát khỏi catch block để không hiện thông báo lỗi
        }
      }

      // Chỉ hiển thị thông báo lỗi cho các lỗi khác không phải 404
      Alert.alert("Lỗi", "Không thể tải danh sách yêu thích!");
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (productId: string) => {
    setSelectedProduct(productId);
    console.log("Chuyển đến trang chi tiết sản phẩm:", productId);
    navigation.navigate("DetailProduct", {
      productId,
      onGoBack: () => {
        // Khi quay lại từ màn hình chi tiết, refresh dữ liệu
        fetchWishlistData();
      },
    });
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      // Lấy user ID từ AsyncStorage
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        Alert.alert(
          "Thông báo",
          "Vui lòng đăng nhập để thực hiện thao tác này!"
        );
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id || user.id;
      console.log("Remove - User ID:", userId);
      console.log("Remove - Product ID:", productId);

      // Kiểm tra tính hợp lệ của userId và productId
      if (!userId || !productId) {
        console.error("userId hoặc productId không hợp lệ:", {
          userId,
          productId,
        });
        Alert.alert("Lỗi", "Thông tin người dùng hoặc sản phẩm không hợp lệ");
        return;
      }

      // Cập nhật giao diện trước để cải thiện UX
      setWishlistItems(wishlistItems.filter((item) => item._id !== productId));

      // Gọi API xóa sản phẩm khỏi wishlist
      try {
        const response = await axios.post(
          "http://10.0.2.2:5001/wishlists/remove",
          {
            userId,
            productId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 5000, // Timeout 5 giây
          }
        );

        console.log(
          "API response for remove:",
          JSON.stringify(response.data, null, 2)
        );

        // Nếu API thành công
        if (response.data.success) {
          console.log("Xóa sản phẩm thành công");
          // Kiểm tra kết quả sau 500ms
          setTimeout(() => {
            verifyWishlistChange(productId, false);
          }, 500);
        } else {
          console.log("Lỗi xóa sản phẩm:", response.data.message);
          // Nếu có lỗi, fetch lại dữ liệu
          await fetchWishlistData();
        }
      } catch (apiError) {
        console.error("API error while removing:", apiError);
        // Thông báo lỗi và fetch lại dữ liệu
        Alert.alert(
          "Lỗi kết nối",
          "Không thể kết nối đến máy chủ. Vui lòng thử lại sau."
        );
        await fetchWishlistData();
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      Alert.alert("Lỗi", "Không thể xóa sản phẩm khỏi danh sách yêu thích!");

      // Nếu lỗi, fetch lại dữ liệu để đồng bộ với server
      await fetchWishlistData();
    }
  };

  // Hàm thêm sản phẩm vào wishlist
  const handleAddToWishlist = async (productId: string) => {
    try {
      // Lấy user ID từ AsyncStorage
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        Alert.alert(
          "Thông báo",
          "Vui lòng đăng nhập để thực hiện thao tác này!"
        );
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id || user.id;

      console.log("Thêm sản phẩm vào wishlist:", productId, userId);

      // Gọi API thêm sản phẩm vào wishlist
      const response = await axios.post("http://10.0.2.2:5001/wishlists/add", {
        userId,
        productId,
      });

      if (response.data.success) {
        // Nếu thành công, cập nhật UI bằng cách fetch lại dữ liệu
        fetchWishlistData();
        Alert.alert("Thành công", "Đã thêm sản phẩm vào danh sách yêu thích");
      } else {
        Alert.alert(
          "Thông báo",
          response.data.message ||
            "Không thể thêm sản phẩm vào danh sách yêu thích"
        );
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.log("Status:", error.response.status);
        console.log("Response data:", error.response.data);

        // Nếu sản phẩm đã tồn tại trong wishlist, thông báo cho người dùng
        if (
          error.response.status === 400 &&
          error.response.data.message.includes("đã có trong Wishlist")
        ) {
          Alert.alert("Thông báo", "Sản phẩm đã có trong danh sách yêu thích");
          return;
        }
      }

      Alert.alert("Lỗi", "Không thể thêm sản phẩm vào danh sách yêu thích!");
    }
  };

  // Hàm thực hiện kiểm tra xem thay đổi wishlist có thành công hay không
  const verifyWishlistChange = async (
    productId: string,
    shouldBeInWishlist: boolean
  ) => {
    try {
      // Lấy user ID từ AsyncStorage
      const userString = await AsyncStorage.getItem("user");
      if (!userString) return;

      const user = JSON.parse(userString);
      const userId = user._id || user.id;

      // Gọi API lấy danh sách wishlist mới nhất
      console.log(
        `Đang kiểm tra sự thay đổi của wishlist cho user ${userId} và sản phẩm ${productId}`
      );
      const response = await axios.get(
        `http://10.0.2.2:5001/wishlists/${userId}`,
        { timeout: 5000 }
      );

      if (response.data && response.data.data && response.data.data.products) {
        // Kiểm tra xem sản phẩm có trong danh sách không
        const products = response.data.data.products;
        const productExists = products.some((item: any) => {
          const id =
            typeof item.product_id === "object"
              ? item.product_id._id
              : item.product_id;
          return id === productId;
        });

        console.log(
          `Sản phẩm ${productId} ${
            productExists ? "có" : "không"
          } trong wishlist`
        );

        // Nếu trạng thái không như mong đợi
        if (productExists !== shouldBeInWishlist) {
          console.log(
            "Trạng thái wishlist không như mong đợi, fetching lại dữ liệu"
          );
          // Gọi lại fetchWishlistData để cập nhật UI
          await fetchWishlistData();
        }
      }
    } catch (error) {
      console.error("Error verifying wishlist change:", error);
      // Không hiển thị thông báo lỗi cho user vì đây chỉ là kiểm tra nội bộ
    }
  };

  // Hàm xử lý yêu thích/bỏ yêu thích sản phẩm (toggle)
  const handleToggleFavorite = async (productId: string) => {
    try {
      // Lấy user ID từ AsyncStorage
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        Alert.alert(
          "Thông báo",
          "Vui lòng đăng nhập để thực hiện thao tác này!"
        );
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id || user.id;
      console.log("User ID:", userId);
      console.log("Product ID:", productId);

      // Kiểm tra tính hợp lệ của userId và productId
      if (!userId || !productId) {
        console.error("userId hoặc productId không hợp lệ:", {
          userId,
          productId,
        });
        Alert.alert("Lỗi", "Thông tin người dùng hoặc sản phẩm không hợp lệ");
        return;
      }

      // Kiểm tra xem sản phẩm có trong danh sách yêu thích hay không
      const isInWishlist = wishlistItems.some((item) => item._id === productId);
      console.log("Sản phẩm có trong wishlist không:", isInWishlist);

      // Cập nhật UI trước để có phản hồi nhanh
      if (isInWishlist) {
        // Nếu đã có trong wishlist, xóa khỏi danh sách
        setWishlistItems(
          wishlistItems.filter((item) => item._id !== productId)
        );
      } else {
        // Nếu chưa có, thực hiện hành động thêm vào (cần có thêm thông tin sản phẩm đầy đủ)
        // Tạm thời không thực hiện gì ở đây, sẽ cập nhật sau khi gọi API thành công
      }

      // Xác định API endpoint dựa trên trạng thái hiện tại
      const url = isInWishlist
        ? "http://10.0.2.2:5001/wishlists/remove"
        : "http://10.0.2.2:5001/wishlists/add";

      console.log(
        `Gọi API: ${url}, productId: ${productId}, userId: ${userId}`
      );

      try {
        // Gọi API với timeout ngắn hơn để tránh chờ quá lâu
        const response = await axios.post(
          url,
          {
            userId,
            productId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 5000, // Timeout 5 giây
          }
        );

        console.log("API response:", JSON.stringify(response.data, null, 2));

        // Nếu thành công, cập nhật danh sách
        if (response.data.success) {
          console.log("Thao tác thành công");
          // Kiểm tra kết quả sau 500ms để cho phép server cập nhật
          setTimeout(() => {
            verifyWishlistChange(productId, !isInWishlist);
          }, 500);
        } else {
          console.log("Thao tác thất bại:", response.data.message);
          Alert.alert(
            "Thông báo",
            response.data.message || "Không thể cập nhật danh sách yêu thích"
          );
          // Khôi phục UI nếu API không thành công
          await fetchWishlistData();
        }
      } catch (apiError) {
        console.error("API error:", apiError);
        if (axios.isAxiosError(apiError)) {
          console.log("Error response data:", apiError.response?.data);
          console.log("Error status:", apiError.response?.status);
        }

        // Khôi phục UI
        Alert.alert(
          "Lỗi kết nối",
          "Không thể kết nối đến máy chủ. Vui lòng thử lại sau."
        );
        await fetchWishlistData();
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      if (axios.isAxiosError(error)) {
        console.log("Error response:", error.response?.data);
        console.log("Error status:", error.response?.status);
      }
      Alert.alert("Lỗi", "Không thể cập nhật danh sách yêu thích");
      // Khôi phục UI bằng cách fetch lại dữ liệu
      await fetchWishlistData();
    }
  };

  // Format giá tiền
  const formatPrice = (price: number): string => {
    return `${price.toLocaleString()} VND`;
  };

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredItems = wishlistItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B5CFD" />
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Sản phẩm yêu thích</Text>
        <View style={{ width: 50 }} />
      </View>

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
            placeholder="Tìm kiếm sản phẩm..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Products */}
      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#7B5CFD" />
          <Text style={styles.emptyText}>Danh sách yêu thích trống</Text>
          <Text style={styles.emptySubText}>
            Hãy thêm sản phẩm yêu thích của bạn!
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate("ProductScreen")}
          >
            <Text style={styles.shopButtonText}>Đi mua sắm</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productItem}
              onPress={() => handleProductPress(item._id)}
            >
              <TouchableOpacity
                style={styles.wishlistButton}
                onPress={() => handleToggleFavorite(item._id)}
              >
                <Icon name="heart" size={24} color="red" />
              </TouchableOpacity>
              <Image
                source={
                  item.images && item.images.length > 0
                    ? { uri: item.images[0] }
                    : require("../assets/images/avatar.jpeg")
                }
                style={styles.productImage}
                resizeMode="cover"
              />
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
              <View style={styles.ratingContainer}>
                <AirbnbRating
                  count={5}
                  defaultRating={item.rating || 5}
                  size={15}
                  showRating={false}
                  isDisabled
                />
                <Text style={styles.reviewText}>
                  <Text style={{ fontWeight: "bold" }}>{item.rating || 5}</Text>{" "}
                  ({item.reviews || 0} đánh giá)
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            searchQuery ? (
              <View style={styles.noResultContainer}>
                <Text style={styles.noResultText}>
                  Không tìm thấy sản phẩm phù hợp
                </Text>
              </View>
            ) : null
          }
        />
      )}
      <BottomNavigationBar navigation={navigation} activeScreen="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 40,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
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
  headerSearch: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchContainer: {
    flex: 1,
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
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 85, // Padding để không bị che bởi bottom navigation
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  productItem: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  wishlistButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#7B5CFD",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  reviewText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  shopButton: {
    backgroundColor: "#7B5CFD",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 25,
    marginBottom: 5,
  },
  shopButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  noResultContainer: {
    padding: 20,
    alignItems: "center",
  },
  noResultText: {
    fontSize: 16,
    color: "#666",
  },
});

export default WishListScreen;
