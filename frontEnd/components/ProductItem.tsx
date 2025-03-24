// components/ProductItem.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
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
  onPress: (productId: string) => void; // Thay đổi từ product sang productId
  onToggleFavorite: () => void;
  isSelected?: boolean; // Optional, mặc định là false
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
}) => {
  // Hàm định dạng giá tiền
  const formatPrice = (price: number) => `${price} Vnd`; // Có thể thay bằng VNĐ nếu cần

  return (
    <TouchableOpacity onPress={() => onPress(product._id)}>
      <View style={[styles.productItem, isSelected && styles.selectedProduct]}>
        {/* Nút yêu thích */}
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={onToggleFavorite}
        >
          <Icon
            name={isFavorite ? "favorite" : "favorite-border"}
            size={SIZES.iconSize}
            color={isFavorite ? COLORS.red : COLORS.darkGray}
          />
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

const styles = StyleSheet.create({
  productItem: {
    width: 220,
    height: 340,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    marginHorizontal: 10,
    marginTop: 20,
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
    width: "100%",
    height: 200,
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
