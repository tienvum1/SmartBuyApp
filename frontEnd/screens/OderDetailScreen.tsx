import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card, Divider } from "react-native-paper";
import BottomNavigationBar from "../components/BottomNavigationBar";
import { Ionicons } from "@expo/vector-icons";

// Định nghĩa type cho đơn hàng (tương tự OrdersScreen)
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

const OrderDetailScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  // Lấy dữ liệu đơn hàng từ route.params
  const order: Order = route.params?.order;

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Order not found</Text>
      </View>
    );
  }

  // Xác định các bước trạng thái đơn hàng
  const orderSteps = [
    {
      label: "Delivered",
      status: "delivered",
      date: order.updatedAt,
      active: false,
    },
    {
      label: "Out for Delivery",
      status: "out_for_delivery",
      date: order.updatedAt,
      active: false,
    },
    {
      label: "Shipped",
      status: "shipped",
      date: order.updatedAt,
      active: false,
    },
    {
      label: "Order Confirmed",
      status: "confirmed",
      date: order.updatedAt,
      active: false,
    },
    {
      label: "Order Placed",
      status: "pending",
      date: order.createdAt,
      active: false,
    },
  ];

  // Cập nhật trạng thái active và disabled dựa trên status của đơn hàng
  const statusOrder = [
    "pending",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
  ];
  const currentStatusIndex = statusOrder.indexOf(order.status);
  const updatedOrderSteps = orderSteps
    .map((step, index) => {
      const stepStatusIndex = statusOrder.indexOf(step.status);
      return {
        ...step,
        active: stepStatusIndex <= currentStatusIndex,
        disabled: stepStatusIndex > currentStatusIndex,
      };
    })
    .reverse(); // Đảo ngược để hiển thị từ "Order Placed" lên "Delivered"

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("OrderScreen")}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Order #{order.orderId}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Nội dung chính, bao bọc trong ScrollView */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc nếu không cần thiết
      >
        {/* Tracking Card */}
        <Card style={styles.trackingCard}>
          <Card.Content>
            <FlatList
              data={updatedOrderSteps}
              keyExtractor={(item) => item.label}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.stepContainer,
                    index === updatedOrderSteps.length - 1 &&
                      styles.lastStepContainer,
                  ]}
                >
                  <View style={styles.stepIndicator}>
                    <View
                      style={[
                        styles.circle,
                        {
                          backgroundColor: item.active ? "#6A5AE0" : "#D3D3D3",
                        },
                      ]}
                    />
                    {index < updatedOrderSteps.length - 1 && (
                      <View
                        style={[
                          styles.connectorLine,
                          {
                            backgroundColor:
                              item.active && updatedOrderSteps[index + 1].active
                                ? "#6A5AE0"
                                : "#E0E0E0",
                          },
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.stepText}>
                    <Text
                      style={[
                        styles.stepLabel,
                        item.disabled && styles.disabledText,
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.stepDate,
                        item.disabled && styles.disabledText,
                      ]}
                    >
                      {item.active
                        ? new Date(item.date).toLocaleDateString()
                        : "Pending"}
                    </Text>
                  </View>
                </View>
              )}
            />
          </Card.Content>
        </Card>

        {/* Order Items */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Order Items</Text>
            <Text style={styles.itemsText}>{order.items.length} items</Text>
            <FlatList
              data={order.items}
              keyExtractor={(item) => item.product_id._id}
              renderItem={({ item }) => (
                <View style={styles.orderItem}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetail}>
                    Quantity: {item.quantity} | Storage:{" "}
                    {item.selected_storage.storage} | Color:{" "}
                    {item.selected_color.color_name}
                  </Text>
                  <Text style={styles.itemSubtotal}>
                    Subtotal: ${item.subtotal.toLocaleString()}
                  </Text>
                </View>
              )}
              ItemSeparatorComponent={() => <Divider />}
              scrollEnabled={false} // Tắt cuộn trong FlatList để ScrollView chính xử lý
            />
          </Card.Content>
        </Card>

        {/* Shipping Details */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Shipping Details</Text>
            <Text style={styles.addressText}>
              {order.shippingAddress.address}
            </Text>
            <Text style={styles.phoneText}>
              {order.shippingAddress.telephone}
            </Text>
          </Card.Content>
        </Card>

        {/* Payment Details */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <Text style={styles.paymentText}>
              Payment Method: {order.paymentMethod.toUpperCase()}
            </Text>
            <Text style={styles.paymentText}>
              Subtotal: ${order.subtotal.toLocaleString()}
            </Text>
            <Text style={styles.paymentText}>
              Shipping Cost: ${order.shippingCost.toLocaleString()}
            </Text>
            <Text style={styles.paymentText}>
              Tax: ${order.tax.toLocaleString()}
            </Text>
            <Text style={[styles.paymentText, styles.totalText]}>
              Total: ${order.total.toLocaleString()}
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 80, // Thêm paddingBottom để tránh bị che bởi BottomNavigationBar
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F9FC",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
  },
  trackingCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 8,
    elevation: 3,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lastStepContainer: {
    paddingBottom: 8,
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: 16,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    zIndex: 1,
  },
  connectorLine: {
    width: 2,
    height: "100%",
    position: "absolute",
    top: 20,
  },
  stepText: {
    flex: 1,
    flexDirection: "column",
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  stepDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  disabledText: {
    color: "#A0A0A0",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  itemsText: {
    fontSize: 16,
    color: "#6A5AE0",
    fontWeight: "500",
    marginBottom: 8,
  },
  orderItem: {
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemDetail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  itemSubtotal: {
    fontSize: 14,
    color: "#00cc00",
    marginTop: 4,
  },
  addressText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  phoneText: {
    fontSize: 15,
    color: "#222",
    marginTop: 6,
    fontWeight: "600",
  },
  paymentText: {
    fontSize: 15,
    color: "#444",
    marginVertical: 2,
  },
  totalText: {
    fontWeight: "700",
    color: "#222",
    marginTop: 6,
  },
});

export default OrderDetailScreen;
