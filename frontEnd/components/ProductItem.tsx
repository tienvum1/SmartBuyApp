import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Định nghĩa type cho Product
type Product = {
  _id: string;
  name: string;
  price: number;
  images: string[];
};

// Định nghĩa interface cho props của ProductItem
interface ProductItemProps {
  product: Product;
  isFavorite: boolean;
  onPress: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
  isSelected?: boolean;
  userId: string;
}

// Hằng số cho style
const COLORS = {
  white: "#fff",
  black: "#000",
  gray: "#e0e0e0",
  darkGray: "#333",
  red: "red",
  purple: "#7B5CFD",
};

const SIZES = {
  borderRadius: 12,
  padding: 12,
  iconSize: 24,
  fontLarge: 20,
  fontMedium: 17,
  shadowOffset: { width: 0, height: 6 },
};

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  isFavorite,
  onPress,
  onToggleFavorite,
  isSelected = false,
  userId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Hàm định dạng giá tiền
  const formatPrice = (price: number): string => {
    return `${price.toLocaleString()} Vnd`;
  };

  // Hàm gọi API để thêm hoặc xóa sản phẩm khỏi Wishlist
  const handleToggleFavorite = async () => {
    if (isLoading) return;

    if (!userId || userId === "default-user-id") {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    setIsLoading(true);
    try {
      const url = isFavorite
        ? "http://10.0.2.2:5001/wishlists/remove"
        : "http://10.0.2.2:5001/wishlists/add";

      console.log(`Calling API: ${url}, isFavorite: ${isFavorite}`);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId: product._id,
        }),
      });

      // Kiểm tra Content-Type của phản hồi
      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        // Nếu không phải JSON, log toàn bộ phản hồi để debug
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server did not return JSON");
      }

      const responseData = await response.json();
      console.log("Response from server:", responseData);

      if (response.ok && responseData.success) {
        onToggleFavorite(product._id);
        console.log(
          `Successfully ${isFavorite ? "removed from" : "added to"} Wishlist`
        );
      } else if (
        response.status === 400 &&
        responseData.message === "Sản phẩm không có trong Wishlist!"
      ) {
        if (isFavorite) {
          onToggleFavorite(product._id);
          console.log("Synchronized client state: removed from favorites");
        }
        Alert.alert("Thông báo", responseData.message);
      } else if (
        response.status === 400 &&
        responseData.message === "Sản phẩm đã có trong Wishlist!"
      ) {
        if (!isFavorite) {
          onToggleFavorite(product._id);
          console.log("Synchronized client state: added to favorites");
        }
        Alert.alert("Thông báo", responseData.message);
      } else {
        Alert.alert(
          "Lỗi",
          responseData.message || "Không thể cập nhật Wishlist"
        );
      }
    } catch (error) {
      console.error("Network Error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi kết nối đến server");
    } finally {
      setIsLoading(false);
      console.log("Finished API call, isLoading set to false");
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(product._id)}>
      <View style={[styles.productItem, isSelected && styles.selectedProduct]}>
        {/* Nút yêu thích */}
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleToggleFavorite}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.darkGray} />
          ) : (
            <Icon
              name={isFavorite ? "favorite" : "favorite-border"}
              size={SIZES.iconSize}
              color={isFavorite ? COLORS.red : COLORS.darkGray}
            />
          )}
        </TouchableOpacity>

        {/* Hình ảnh sản phẩm */}
        <Image
          source={{
            uri:
              product.images && product.images.length > 0
                ? product.images[0]
                : "https://via.placeholder.com/200",
          }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Tên sản phẩm */}
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {product.name}
        </Text>

        {/* Giá sản phẩm */}
        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Styles
const styles = StyleSheet.create({
  productItem: {
    width: 220,
    height: 300,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    marginHorizontal: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: SIZES.shadowOffset,
    elevation: 12,
  },
  selectedProduct: {
    borderColor: COLORS.purple,
    borderWidth: 2,
  },
  wishlistButton: {
    position: "absolute",
    top: SIZES.padding,
    right: SIZES.padding,
    zIndex: 10,
  },
  productImage: {
    width: "80%",
    height: 150,
    alignSelf: "center",
    borderRadius: SIZES.borderRadius - 2,
  },
  productName: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.black,
    marginTop: SIZES.padding,
    marginLeft: SIZES.padding / 2,
  },
  productPrice: {
    fontSize: SIZES.fontMedium,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginTop: SIZES.padding / 2,
    marginLeft: SIZES.padding / 2,
  },
});

export default ProductItem;
