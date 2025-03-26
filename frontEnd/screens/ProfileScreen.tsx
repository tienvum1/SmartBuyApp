import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import BottomNavigationBar from "../components/BottomNavigationBar";

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Lấy thông tin người dùng và token từ AsyncStorage
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }

        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ AsyncStorage", error);
      }
    };

    getUserData();
  }, []);

  if (!user) {
    return <Text>Đang tải thông tin người dùng...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          source={require("../assets/images/avatar.jpeg")}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.infoGroup}>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>
            {user.full_name || "Tên người dùng"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>{user.role || "Tên người dùng"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            {user.email || "Email người dùng"}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              navigation.navigate("EditProfileScreen");
            }}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>{user.phone}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("AllAddressScreen")}
        >
          <Text style={styles.menuText}>Address</Text>
          <Icon name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("WishListScreen")}
        >
          <Text style={styles.menuText}>Wishlist</Text>
          <Icon name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("PaymentScreen")}
        >
          <Text style={styles.menuText}>Payment</Text>
          <Icon name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("HelpScreen")}
        >
          <Text style={styles.menuText}>Help</Text>
          <Icon name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Support</Text>
          <Icon name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <BottomNavigationBar navigation={navigation} activeScreen="Profile" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 60,
    marginTop: 60,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
  },
  profileImageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  infoGroup: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 12,
    marginBottom: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  infoText: {
    fontSize: 16,
    color: "#666",
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
  editText: {
    fontSize: 14,
    color: "#6A5AE0",
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuText: {
    fontSize: 16,
    color: "#000",
  },
  signOutButton: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    marginVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signOutText: {
    fontSize: 16,
    color: "#FF4444",
    fontWeight: "600",
  },
});

export default ProfileScreen;
