import React, { useState } from "react";
import BottomNavigationBar from "../components/BottomNavigationBar";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const notifications = [
  { id: "1", message: "Bạn có một tin nhắn mới." },
  { id: "2", message: "Đơn hàng của bạn đã được xác nhận." },
  { id: "3", message: "Cập nhật mới về chính sách bảo mật." },
];

const NotificationScreen = ({ navigation }: { navigation: any }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>Notifications</Text>
        <View style={styles.notificationList}>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>{item.message}</Text>
              </View>
            )}
          />
        </View>
      </View>
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  content: {
    marginTop: 100,
    flex: 1, // Đẩy nội dung lên trên
    alignItems: "center", // căn theo chiều ngang
  },
  notificationItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: 800,
    height: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
  },
  notificationList: {
    flex: 1,
    marginTop: 20,
  },
  notificationText: {
    fontSize: 16,
  },
});

export default NotificationScreen;
