// screens/OrdersScreen.tsx
import React, { useState, useEffect, useRef } from "react"; // Thêm useRef
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { Ionicons } from "@expo/vector-icons";

interface OrderItem {
  product_id: { _id: string; name: string };
  name: string;
  quantity: number;
  selected_storage: { storage: string; price: number };
  selected_color: { color_name: string };
  subtotal: number;
}

interface Order {
  orderId: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: { telephone: string; address: string };
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const OrdersScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const orderIdFromNotification = route.params?.orderId;

  // Sử dụng useRef để tạo tham chiếu cho FlatList
  const flatListRef = useRef<FlatList<Order> | null>(null);

  const getUserId = async () => {
    const userString = await AsyncStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    console.log("User from AsyncStorage:", user);
    return user?._id;
  };

  const fetchOrders = async (status?: string) => {
    try {
      setLoading(true);
      const userId = await getUserId();
      if (!userId) {
        Alert.alert("Error", "Please log in to view orders");
        navigation.navigate("Login");
        return;
      }

      console.log(
        "Fetching orders for userId:",
        userId,
        "with status:",
        status
      );
      const url = status
        ? `http://10.0.2.2:5001/checkouts/orders/${userId}/${status}`
        : `http://10.0.2.2:5001/checkouts/user-orders?userId=${userId}${
            status ? `&status=${status}` : ""
          }`;
      const response = await axios.get(url);
      console.log("Orders response:", response.data);
      setOrders(response.data.orders);

      if (orderIdFromNotification) {
        const index = response.data.orders.findIndex(
          (order: Order) => order.orderId === orderIdFromNotification
        );
        if (index !== -1) {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index, animated: true }); // Sử dụng flatListRef.current
          }, 500);
        }
      }
    } catch (error: unknown) {
      console.error("Error fetching orders:", error);
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          Alert.alert(
            "Error",
            `Failed to load orders: ${
              error.response.data.message || "Unknown error"
            }`
          );
        } else if (error.request) {
          console.error("No response received:", error.request);
          Alert.alert(
            "Error",
            "Network error: Unable to connect to the server. Please check your server or network."
          );
        } else {
          console.error("Error message:", error.message);
          Alert.alert("Error", `Failed to load orders: ${error.message}`);
        }
      } else if (error instanceof Error) {
        console.error("Error message:", error.message);
        Alert.alert("Error", `Failed to load orders: ${error.message}`);
      } else {
        Alert.alert("Error", "An unknown error occurred while fetching orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const userId = await getUserId();
      const response = await axios.post(
        "http://10.0.2.2:5001/checkouts/cancel",
        {
          orderId,
          userId,
        }
      );
      Alert.alert(
        "Success",
        response.data.message || "Order cancelled successfully"
      );
      fetchOrders(selectedStatus || undefined);
    } catch (error: unknown) {
      console.error("Error cancelling order:", error);
      if (error instanceof AxiosError) {
        if (error.response) {
          Alert.alert(
            "Error",
            `Failed to cancel order: ${
              error.response.data.message || "Unknown error"
            }`
          );
        } else {
          Alert.alert("Error", "Failed to cancel order: Network error");
        }
      } else {
        Alert.alert(
          "Error",
          "An unknown error occurred while cancelling the order"
        );
      }
    }
  };

  const confirmDelivery = async (orderId: string) => {
    try {
      const userId = await getUserId();
      const response = await axios.post(
        "http://10.0.2.2:5001/checkouts/confirm-delivery",
        {
          orderId,
          userId,
        }
      );
      Alert.alert(
        "Success",
        response.data.message || "Delivery confirmed successfully"
      );
      fetchOrders(selectedStatus || undefined);
    } catch (error: unknown) {
      console.error("Error confirming delivery:", error);
      if (error instanceof AxiosError) {
        if (error.response) {
          Alert.alert(
            "Error",
            `Failed to confirm delivery: ${
              error.response.data.message || "Unknown error"
            }`
          );
        } else {
          Alert.alert("Error", "Failed to confirm delivery: Network error");
        }
      } else {
        Alert.alert(
          "Error",
          "An unknown error occurred while confirming delivery"
        );
      }
    }
  };

  const requestReturn = async (orderId: string) => {
    try {
      const userId = await getUserId();
      const reason = "Product not as expected";
      const response = await axios.post(
        "http://10.0.2.2:5001/checkouts/request-return",
        {
          orderId,
          userId,
          reason,
        }
      );
      Alert.alert(
        "Success",
        response.data.message || "Return request submitted successfully"
      );
      fetchOrders(selectedStatus || undefined);
    } catch (error: unknown) {
      console.error("Error requesting return:", error);
      if (error instanceof AxiosError) {
        if (error.response) {
          Alert.alert(
            "Error",
            `Failed to request return: ${
              error.response.data.message || "Unknown error"
            }`
          );
        } else {
          Alert.alert("Error", "Failed to request return: Network error");
        }
      } else {
        Alert.alert(
          "Error",
          "An unknown error occurred while requesting return"
        );
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }: { item: Order }) => {
    const statusLabels: { [key: string]: string } = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      shipped: "Đã giao cho đơn vị vận chuyển",
      out_for_delivery: "Đang giao hàng",
      delivered: "Đã giao hàng thành công",
      cancelled: "Đã hủy",
      returned: "Đã trả hàng",
      refunded: "Đã hoàn tiền",
      failed: "Giao hàng thất bại",
    };

    const statusColors: { [key: string]: string } = {
      pending: "#FFA500",
      confirmed: "#32CD32",
      shipped: "#FFD700",
      out_for_delivery: "#FF4500",
      delivered: "#008000",
      cancelled: "#FF0000",
      returned: "#FF6347",
      refunded: "#800080",
      failed: "#DC143C",
    };

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("OrderDetailScreen", { order: item })
        }
        style={[
          styles.orderContainer,
          item.orderId === orderIdFromNotification && styles.highlightedOrder,
        ]}
      >
        <Text style={styles.orderId}>Order ID: {item.orderId}</Text>
        <Text style={styles.orderTotal}>
          Total: ${item.total.toLocaleString()}
        </Text>
        <Text
          style={[
            styles.orderStatus,
            { color: statusColors[item.status] || "#ccc" },
          ]}
        >
          Status: {statusLabels[item.status] || "Unknown"}
        </Text>
        <Text style={styles.orderDate}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <FlatList
          data={item.items}
          keyExtractor={(item) => item.product_id._id}
          renderItem={({ item: orderItem }) => (
            <View style={styles.orderItem}>
              <Text style={styles.itemName}>{orderItem.name}</Text>
              <Text style={styles.itemDetail}>
                Quantity: {orderItem.quantity} | Storage:{" "}
                {orderItem.selected_storage.storage} | Color:{" "}
                {orderItem.selected_color.color_name}
              </Text>
              <Text style={styles.itemSubtotal}>
                Subtotal: ${orderItem.subtotal.toLocaleString()}
              </Text>
            </View>
          )}
          scrollEnabled={false}
        />
        <View style={styles.actions}>
          {["pending", "confirmed", "shipped"].includes(
            item.status
          ) && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => cancelOrder(item.orderId)}
            >
              <Text style={styles.actionText}>Cancel Order</Text>
            </TouchableOpacity>
          )}
          {item.status === "out_for_delivery" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => confirmDelivery(item.orderId)}
            >
              <Text style={styles.actionText}>Confirm Delivery</Text>
            </TouchableOpacity>
          )}
          {item.status === "delivered" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.returnButton]}
              onPress={() => requestReturn(item.orderId)}
            >
              <Text style={styles.actionText}>Request Return</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderStatusFilter = () => {
    const statuses = [
      "pending",
      "confirmed",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
      "returned",
      "refunded",
      "failed",
    ];

    return (
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            !selectedStatus && styles.selectedFilter,
          ]}
          onPress={() => {
            setSelectedStatus(null);
            fetchOrders();
          }}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              selectedStatus === status && styles.selectedFilter,
            ]}
            onPress={() => {
              setSelectedStatus(status);
              fetchOrders(status);
            }}
          >
            <Text style={styles.filterText}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity
          onPress={() => fetchOrders(selectedStatus || undefined)}
        >
          <Ionicons name="refresh" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {renderStatusFilter()}
      {loading ? (
        <ActivityIndicator size="large" color="#8E6CEF" />
      ) : (
        <FlatList
          ref={flatListRef} // Sử dụng flatListRef trực tiếp
          data={orders}
          keyExtractor={(item) => item.orderId}
          renderItem={renderOrderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No orders found</Text>
          }
          contentContainerStyle={styles.listContent}
          onScrollToIndexFailed={(info) => {
            console.warn("Scroll to index failed:", info);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFilter: {
    backgroundColor: "#8E6CEF",
  },
  filterText: {
    color: "#000",
    fontSize: 14,
  },
  orderContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  highlightedOrder: {
    borderWidth: 2,
    borderColor: "#8E6CEF",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderTotal: {
    fontSize: 14,
    color: "#00cc00",
    marginVertical: 4,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 4,
  },
  orderDate: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  orderItem: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  itemDetail: {
    fontSize: 12,
    color: "#666",
  },
  itemSubtotal: {
    fontSize: 12,
    color: "#00cc00",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#FF0000",
  },
  confirmButton: {
    backgroundColor: "#008000",
  },
  returnButton: {
    backgroundColor: "#FF6347",
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default OrdersScreen;
