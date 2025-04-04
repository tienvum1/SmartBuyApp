import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface CartItem {
  _id: string;
  name: string;
  quantity: number;
  selected_storage: { storage: string; price: number };
  selected_color: { color_name: string };
  subtotal: number;
}

interface Address {
  _id: string;
  phone: string;
  address: string;
  is_primary?: boolean;
}

type CheckoutDetailScreenRouteProp = RouteProp<ReactNavigation.RootParamList, 'CheckoutDetailScreen'>;
type CheckoutDetailScreenNavigationProp = StackNavigationProp<ReactNavigation.RootParamList, 'CheckoutDetailScreen'>;

type Props = {
  navigation: CheckoutDetailScreenNavigationProp;
  route: CheckoutDetailScreenRouteProp;
};

const CheckoutDetailScreen = ({ navigation, route }: Props) => {
  const { selectedItems, total } = route.params;
  const [items] = useState<CartItem[]>(selectedItems);
  const [totals] = useState<number>(total);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("cod");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const shippingFee = 30000;

  useEffect(() => {
    const fetchAddressesAndSetTotal = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        console.log("CheckoutDetailScreen - User in AsyncStorage:", userString);
        
        if (!userString) {
          console.log("CheckoutDetailScreen - No user found in AsyncStorage");
          navigation.navigate("SignInScreen");
          return;
        }

        const user = JSON.parse(userString);
        console.log("CheckoutDetailScreen - Parsed user:", user);
        
        const userId = user._id;
        if (!userId) {
          console.error("CheckoutDetailScreen - User ID is missing in AsyncStorage");
          console.log("CheckoutDetailScreen - User data structure:", JSON.stringify(user, null, 2));
          setAddresses([]);
          setUserId(null);
          return;
        }

        setUserId(userId);
        console.log("CheckoutDetailScreen - Using userId:", userId);

        try {
          const addressResponse = await axios.get(
            `http://10.0.2.2:5001/users/getAllAddresses/${userId}`
          );
          console.log("API Response:", addressResponse.data);

          const fetchedAddresses = addressResponse.data.addresses || [];
          console.log("Fetched Addresses:", fetchedAddresses);

          setAddresses(fetchedAddresses);
          const primaryAddress = fetchedAddresses.find(
            (addr: Address) => addr.is_primary
          );
          setSelectedAddress(primaryAddress || null); // Mặc định chọn địa chỉ chính
        } catch (addressError) {
          console.error("Error fetching addresses from API:", addressError);
          // Nếu không thể lấy địa chỉ từ API, hiển thị thông báo
          alert("Could not load addresses. Please check your connection and try again.");
        }
      } catch (error) {
        console.error("Error in fetchAddressesAndSetTotal:", error);
        setAddresses([]);
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAddressesAndSetTotal();
  }, []);

  const grandTotal = totals + shippingFee;

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetails}>
        {item.selected_storage.storage} | {item.selected_color.color_name} |
        Qty: {item.quantity}
      </Text>
      <Text style={styles.itemPrice}>{item.subtotal.toLocaleString()} VND</Text>
    </View>
  );

  const renderAddressItem = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={[
        styles.addressItem,
        selectedAddress?._id === item._id && styles.selectedAddressItem,
      ]}
      onPress={() => {
        setSelectedAddress(item);
        setShowAddressModal(false);
      }}
    >
      <Text style={styles.addressText}>{item.address}</Text>
      <Text style={styles.addressText}>{item.phone}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#4A5568" />
        </TouchableOpacity>
        <Text style={styles.header}>Checkout</Text>
      </View>

      <Text style={styles.userIdText}>
        User ID: {userId || "Not available"}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={styles.itemList}
          ListEmptyComponent={<Text>No items selected</Text>}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => setShowAddressModal(true)}
        >
          <Text style={styles.optionLabel}>Delivery to</Text>
          <Text style={styles.optionValue}>
            {selectedAddress
              ? `${selectedAddress.address} - ${selectedAddress.phone}`
              : "Select Shipping Address"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            console.log("Navigating to AddAddressScreen with userId:", userId);
            navigation.navigate("AddAddressScreen", { userId });
          }}
        >
          <Text style={styles.addButtonText}>+ Add New Address</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity
          style={[
            styles.option,
            selectedPayment === "cod" && styles.selectedOption,
          ]}
          onPress={() => setSelectedPayment("cod")}
        >
          <Text style={styles.optionValue}>Cash on Delivery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            selectedPayment === "stripe" && styles.selectedOption,
          ]}
          onPress={() => setSelectedPayment("stripe")}
        >
          <View style={styles.paymentMethodRow}>
            <Text style={styles.optionValue}>Pay with Stripe</Text>
            <Text style={styles.paymentMethodDescription}>(Credit Card, Google Pay, Apple Pay)</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Subtotal ({items.length} items)
          </Text>
          <Text style={styles.summaryValue}>{totals.toLocaleString()} VND</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping Fee</Text>
          <Text style={styles.summaryValue}>
            {shippingFee.toLocaleString()} VND
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>
            {grandTotal.toLocaleString()} VND
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.checkoutButton,
          { opacity: items.length > 0 && selectedAddress ? 1 : 0.5 },
        ]}
        onPress={async () => {
          try {
            const userString = await AsyncStorage.getItem("user");
            const user = JSON.parse(userString || "{}");
            const userId = user._id;
            
            console.log("User ID before order:", userId);
            console.log("User ID type:", typeof userId);
            
            if (!selectedAddress) {
              alert("Please select a shipping address");
              return;
            }
            
            console.log("Selected Address ID:", selectedAddress._id);
            console.log("Selected Address ID type:", typeof selectedAddress._id);
            
            if (items.length === 0) {
              alert("Please select at least one item");
              return;
            }

            if (selectedPayment === "stripe") {
              navigation.navigate("StripePaymentScreen", {
                amount: grandTotal,
                shippingAddressId: selectedAddress._id,
                selectedItemIds: items.map(item => item._id)
              });
              return;
            }

            console.log("Selected Address trước khi gửi:", selectedAddress);
            const selectedItemIds = items.map((item) => item._id);
            console.log("Payload gửi đi:", {
              shippingAddressId: selectedAddress._id,
              paymentMethod: selectedPayment,
              selectedItemIds,
              total: grandTotal,
              userId: userId,
            });

            try {
              const response = await axios.post(
                "http://10.0.2.2:5001/checkouts/placeOrder",
                {
                  shippingAddressId: selectedAddress._id,
                  paymentMethod: selectedPayment,
                  selectedItemIds,
                  total: grandTotal,
                  userId: userId,
                }
              );

              if (response.data.success) {
                navigation.navigate("OrderSuccessScreen");
              } else {
                console.error("Server returned error:", response.data);
                alert(response.data.message || "Failed to place order");
              }
            } catch (apiError: any) {
              console.error("API Error:", apiError);
              const errorMessage = apiError.response?.data?.message || apiError.response?.data?.error || apiError.message;
              console.error("Error details:", errorMessage);
              alert(`Failed to place order: ${errorMessage}`);
            }
          } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order");
          }
        }}
        disabled={items.length === 0 || !selectedAddress}
      >
        <Text style={styles.checkoutText}>
          {grandTotal.toLocaleString()} VND - Place Order
        </Text>
      </TouchableOpacity>

      <Modal visible={showAddressModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Shipping Address</Text>
          <FlatList
            data={addresses}
            renderItem={renderAddressItem}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={<Text>No addresses available</Text>}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowAddressModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

// Styles giữ nguyên như bạn đã cung cấp
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  userIdText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDetails: {
    fontSize: 14,
    color: "#777",
  },
  itemPrice: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  itemList: {
    maxHeight: 200,
  },
  option: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: "#7B61FF",
  },
  optionLabel: {
    fontSize: 12,
    color: "#999",
  },
  optionValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  addButton: {
    padding: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#7B61FF",
    fontSize: 16,
    fontWeight: "bold",
  },
  summary: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginBottom: 80,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#555",
  },
  summaryValue: {
    fontSize: 16,
    color: "#000",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  checkoutButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#7B61FF",
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addressItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  selectedAddressItem: {
    backgroundColor: "#e6f0fa",
  },
  addressText: {
    fontSize: 16,
  },
  closeButton: {
    padding: 15,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentMethodRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  paymentMethodDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default CheckoutDetailScreen;
