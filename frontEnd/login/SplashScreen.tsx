import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      setTimeout(() => {
        if (token) {
          navigation.replace("HomePage"); // Chuyển vào Home nếu đã đăng nhập
        } else {
          navigation.replace("SignIn"); // Chuyển vào SignIn nếu chưa có token
        }
      }, 2000);
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SmartBuy</Text>
      <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A178FC",
  },
  title: { fontSize: 32, color: "#fff", fontWeight: "bold" },
});
