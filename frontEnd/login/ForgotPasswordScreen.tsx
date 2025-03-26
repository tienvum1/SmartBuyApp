import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const ForgotPasswordScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ email!");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi", "Địa chỉ email không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://10.0.2.2:5001/users/reset-password", {
        email,
        newPassword
      });

      Alert.alert(
        "Thành công",
        "Mật khẩu của bạn đã được đặt lại thành công!",
        [
          {
            text: "Đăng nhập",
            onPress: () => navigation.navigate("SignIn")
          }
        ]
      );
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        "Không thể đặt lại mật khẩu. Vui lòng thử lại sau.";
      
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Ionicons name="chevron-back" size={40} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Đặt Lại Mật Khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập email và mật khẩu mới của bạn để đặt lại mật khẩu
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.returnLink}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.returnText}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm toàn bộ chiều cao của màn hình
    justifyContent: "flex-start", // Đưa nội dung lên phía trên
    alignItems: "flex-start", // Căn nội dung về bên trái màn hình
    paddingHorizontal: 30, // Khoảng cách hai bên lề là 30px
    backgroundColor: "#FFF",
    width: "100%",
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
    marginTop: 140,
    marginBottom: 20,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    lineHeight: 24,
  },
  icon: {
    position: "absolute",
    top: 100,
    left: 30,
    zIndex: 1,
    backgroundColor: "#F5F5F5", // Màu nâu
    width: 60, // Kích thước vòng tròn
    height: 60,
    borderRadius: 30, // Bo tròn
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Đổ bóng nhẹ
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Cho Android
  },
  input: {
    width: "100%",
    height: 80,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    fontSize: 20,
    color: "#000",
  },
  button: {
    backgroundColor: "#7B5BDF",
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  returnLink: {
    marginTop: 25,
    alignSelf: 'center',
  },
  returnText: {
    fontSize: 18,
    color: "#7B5BDF",
    fontWeight: "600",
  },
});
