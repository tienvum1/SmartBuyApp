import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Đảm bảo bạn đã cài đặt thư viện này

const BottomNavigationBar = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("HomePage")}
      >
        <Icon name="home" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("NotificationScreen")}
      >
        <Icon name="notifications" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("OrderScreen")}
      >
        <Icon name="assignment" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("ProfileScreen")}
      >
        <Icon name="account-circle" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "white", // Màu nền của thanh điều hướng
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 5,
    elevation: 5, // Hiệu ứng đổ bóng trên Android
  },
  iconContainer: {
    padding: 10,
  },
});

export default BottomNavigationBar;
