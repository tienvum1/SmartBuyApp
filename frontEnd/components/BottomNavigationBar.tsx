import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Các màu sắc được sử dụng trong thanh điều hướng
const COLORS = {
  white: "#fff",
  gray: "#A0A0A0",
  lightGray: "#E0E0E0",
  primary: "#6B48FF",
  darkPurple: "#5B3FD9",
};

type BottomNavigationBarProps = {
  navigation: any;
  activeScreen?: string;
};

const BottomNavigationBar = ({ 
  navigation, 
  activeScreen = "Home" 
}: BottomNavigationBarProps) => {
  
  // Danh sách các mục điều hướng
  const navigationItems = [
    { 
      name: "Home", 
      icon: "home-outline", 
      activeIcon: "home", 
      screen: "HomePage" 
    },
    { 
      name: "Search", 
      icon: "search-outline", 
      activeIcon: "search", 
      screen: "ProductScreen" 
    },
    { 
      name: "Cart", 
      icon: "cart-outline", 
      activeIcon: "cart", 
      screen: "CartScreen" 
    },
    { 
      name: "Orders", 
      icon: "document-text-outline", 
      activeIcon: "document-text", 
      screen: "OrderScreen" 
    },
    { 
      name: "Profile", 
      icon: "person-outline", 
      activeIcon: "person", 
      screen: "ProfileScreen" 
    },
  ];

  return (
    <View style={styles.bottomNav}>
      {navigationItems.map((item) => {
        const isActive = activeScreen === item.name;
        
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            {isActive ? (
              // Hiển thị biểu tượng active nếu đang ở màn hình hiện tại
              <View style={styles.navIconActive}>
                <Ionicons 
                  name={item.activeIcon} 
                  size={24} 
                  color={COLORS.white} 
                />
              </View>
            ) : (
              // Hiển thị biểu tượng thông thường
              <Ionicons 
                name={item.icon} 
                size={24} 
                color={COLORS.gray} 
              />
            )}
            <Text style={[
              styles.navText,
              isActive && styles.activeNavText
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 5,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconActive: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.darkPurple,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  navText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  activeNavText: {
    color: COLORS.darkPurple,
    fontWeight: "bold",
  },
});

export default BottomNavigationBar;
