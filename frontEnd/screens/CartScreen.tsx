import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import BottomNavigationBar from "../components/BottomNavigationBar";

type RootStackParamList = {
  CartScreen: { userId: string };
  CheckoutDetailScreen: { selectedItems: CartItem[]; total: number };
  Login: undefined;
};

type CartScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CartScreen"
>;

interface CartItem {
  _id: string;
  product_id: string;
  name: string;
  quantity: number;
  selected_storage: { storage: string; price: number };
  selected_color: { color_name: string };
  image: string;
  subtotal: number;
}

interface CartScreenProps {
  navigation: CartScreenNavigationProp;
}

const { width } = Dimensions.get("window");

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (!userString) {
          navigation.navigate("Login");
          return;
        }

        const user = JSON.parse(userString);
        const userId = user._id;

        const response = await axios.get(
          `http://10.0.2.2:5001/carts/${userId}`
        );
        setCartItems(response.data.items || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigation]);

  const toggleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const selectAllItems = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item._id));
    }
  };

  const updateQuantity = async (
    itemId: string,
    type: "increase" | "decrease"
  ) => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?._id;

      const item = cartItems.find((i) => i._id === itemId);
      if (!item) return;

      const newQuantity =
        type === "increase"
          ? item.quantity + 1
          : Math.max(1, item.quantity - 1);

      await axios.patch(
        `http://10.0.2.2:5001/carts/${userId}/items/${itemId}`,
        {
          quantity: newQuantity,
        }
      );

      setCartItems(
        cartItems.map((item) =>
          item._id === itemId
            ? {
                ...item,
                quantity: newQuantity,
                subtotal: item.selected_storage.price * newQuantity,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?._id;

      await axios.delete(
        `http://10.0.2.2:5001/carts/${userId}/items/${itemId}`
      );
      setCartItems(cartItems.filter((item) => item._id !== itemId));
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const removeAll = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?._id;

      for (const item of cartItems) {
        await axios.delete(
          `http://10.0.2.2:5001/carts/${userId}/items/${item._id}`
        );
      }
      setCartItems([]);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error removing all items:", error);
    }
  };

  const selectedSubtotal = cartItems
    .filter((item) => selectedItems.includes(item._id))
    .reduce((total, item) => total + item.subtotal, 0);

  const getSelectedItemsData = () => {
    return cartItems.filter((item) => selectedItems.includes(item._id));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#4A5568" />
        </TouchableOpacity>
        <Text style={styles.title}>My Cart ({cartItems.length})</Text>
        <TouchableOpacity onPress={removeAll} style={styles.removeAllButton}>
          <Ionicons name="trash-outline" size={24} color="#E53E3E" />
        </TouchableOpacity>
      </View>

      {cartItems.length > 0 && (
        <View style={styles.selectAllContainer}>
          <TouchableOpacity
            onPress={selectAllItems}
            style={styles.selectAllButton}
          >
            <Ionicons
              name={
                selectedItems.length === cartItems.length &&
                cartItems.length > 0
                  ? "checkbox"
                  : "square-outline"
              }
              size={24}
              color="#6B46C1"
            />
            <Text style={styles.selectAllText}>Select All</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <TouchableOpacity
              onPress={() => toggleSelectItem(item._id)}
              style={styles.checkboxContainer}
            >
              <Ionicons
                name={
                  selectedItems.includes(item._id)
                    ? "checkbox"
                    : "square-outline"
                }
                size={24}
                color={selectedItems.includes(item._id) ? "#6B46C1" : "#A0AEC0"}
              />
            </TouchableOpacity>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.itemDetails}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>
                {item.selected_storage.storage} |{" "}
                {item.selected_color.color_name}
              </Text>
              <Text style={styles.price}>${item.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.actionContainer}>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item._id, "decrease")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item._id, "increase")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(item._id)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash" size={20} color="#E53E3E" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your cart is empty</Text>
        }
      />

      <View style={styles.summary}>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>
            Total ({selectedItems.length} items)
          </Text>
          <Text style={styles.totalValue}>${selectedSubtotal.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.checkoutButton,
          { opacity: selectedItems.length > 0 ? 1 : 0.5 },
        ]}
        onPress={
          () =>
            navigation.navigate("CheckoutDetailScreen", {
              selectedItems: getSelectedItemsData(),
              total: selectedSubtotal,
            })
        }
        disabled={selectedItems.length === 0}
        activeOpacity={0.7}
      >
        <Text style={styles.checkoutText}>
          Checkout ({selectedItems.length})
        </Text>
        <Ionicons
          name="arrow-forward"
          size={18}
          color="#FFFFFF"
          style={styles.checkoutIcon}
        />
      </TouchableOpacity>
      
      <BottomNavigationBar navigation={navigation} activeScreen="Cart" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    padding: 16,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#A0AEC0",
    marginTop: 40,
    fontFamily: "Roboto",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    fontFamily: "Roboto",
  },
  removeAllButton: {
    padding: 8,
  },
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginLeft: 8,
    fontFamily: "Roboto",
  },
  listContent: {
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkboxContainer: {
    padding: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    fontFamily: "Roboto",
  },
  details: {
    fontSize: 14,
    color: "#718096",
    marginVertical: 4,
    fontFamily: "Roboto",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#48BB78",
    fontFamily: "Roboto",
  },
  actionContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#6B46C1",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  quantity: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2D3748",
    marginHorizontal: 12,
    fontFamily: "Roboto",
  },
  removeButton: {
    padding: 8,
  },
  summary: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  totalRow: {
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6B46C1",
    fontFamily: "Roboto",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    fontFamily: "Roboto",
  },
  checkoutButton: {
    flexDirection: "row",
    backgroundColor: "#6B46C1",
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Roboto",
    marginRight: 8,
  },
  checkoutIcon: {
    marginLeft: 4,
  },
});

export default CartScreen;
