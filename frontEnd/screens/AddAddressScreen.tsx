import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Định nghĩa type cho navigation và route
interface AddAddressScreenProps {
  navigation: any;
  route: any;
}

// Hằng số cho style
const COLORS = {
  white: "#fff",
  black: "#000",
  gray: "#e0e0e0",
  darkGray: "#333",
  primary: "#6B48FF",
  red: "red",
};

const SIZES = {
  borderRadius: 12,
  padding: 16,
  fontLarge: 18,
  fontMedium: 16,
  fontSmall: 14,
};

const AddAddressScreen: React.FC<AddAddressScreenProps> = ({
  navigation,
  route,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(true);

  // Lấy userId từ AsyncStorage khi màn hình mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserId(user._id);
        } else {
          Alert.alert("Lỗi", "Vui lòng đăng nhập để thêm địa chỉ!");
          navigation.navigate("SignIn");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        Alert.alert("Lỗi", "Không thể lấy thông tin người dùng");
      } finally {
        setIsFetchingUser(false);
      }
    };

    fetchUser();
  }, []);

  // Hàm xử lý thêm địa chỉ
  const handleAddAddress = async () => {
    if (!address.trim() || !phone.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ địa chỉ và số điện thoại!");
      return;
    }

    // Kiểm tra định dạng số điện thoại (ví dụ: 10 chữ số)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert("Lỗi", "Số điện thoại phải có 10 chữ số!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://10.0.2.2:5001/users/addAddress/${userId}`,
        {
          address,
          phone,
        }
      );

      if (response.status === 201) {
        Alert.alert("Thành công", "Địa chỉ đã được thêm thành công!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(), // Quay lại màn hình trước
          },
        ]);
        // Reset form
        setAddress("");
        setPhone("");
      }
    } catch (error: any) {
      console.error("Error adding address:", error);
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Có lỗi xảy ra khi thêm địa chỉ"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Hiển thị loading khi đang lấy thông tin user
  if (isFetchingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Tiêu đề */}
        <Text style={styles.title}>Thêm địa chỉ giao hàng</Text>

        {/* Trường nhập địa chỉ */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Địa chỉ</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập địa chỉ giao hàng"
            placeholderTextColor={COLORS.gray}
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Trường nhập số điện thoại */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            placeholderTextColor={COLORS.gray}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Nút thêm địa chỉ */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleAddAddress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Thêm địa chỉ</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    padding: SIZES.padding,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 10,
    fontSize: SIZES.fontMedium,
    color: COLORS.darkGray,
  },
  title: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: SIZES.fontMedium,
    color: COLORS.black,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    fontSize: SIZES.fontMedium,
    color: COLORS.black,
    backgroundColor: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.borderRadius,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: COLORS.gray,
  },
  buttonText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default AddAddressScreen;
