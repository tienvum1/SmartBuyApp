import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignInScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://10.0.2.2:5001/users/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;

        // Kiểm tra tính hợp lệ của dữ liệu trả về
        if (!token) {
          Alert.alert("Lỗi", "Không nhận được token xác thực!");
          return;
        }

        if (!user) {
          Alert.alert("Lỗi", "Không nhận được thông tin người dùng!");
          return;
        }
        
        // Đảm bảo cấu trúc dữ liệu người dùng phù hợp
        if (!user._id && user.id) {
          user._id = user.id;
        } else if (!user._id && !user.id) {
          Alert.alert("Lỗi", "Dữ liệu người dùng không hợp lệ!");
          return;
        }
        
        try {
          // Lưu token vào AsyncStorage
          await AsyncStorage.setItem("token", token);
          await AsyncStorage.setItem("user", JSON.stringify(user));

          // Kiểm tra lại dữ liệu đã lưu
          const savedToken = await AsyncStorage.getItem("token");
          const savedUser = await AsyncStorage.getItem("user");
          
          if (!savedToken || !savedUser) {
            Alert.alert("Lỗi", "Không thể lưu thông tin đăng nhập!");
            return;
          }
          
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            
            if (!parsedUser._id && !parsedUser.id) {
              Alert.alert("Lỗi", "Dữ liệu người dùng lưu trữ không hợp lệ!");
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("user");
              return;
            }
          }

          Alert.alert("Thành công", "Đăng nhập thành công!");
          // Truyền dữ liệu user vào route.params khi chuyển màn hình
          navigation.navigate("HomePage", { user: user });
        } catch (storageError) {
          console.error("Error saving to AsyncStorage:", storageError);
          Alert.alert("Lỗi", "Không thể lưu thông tin đăng nhập!");
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Đăng nhập thất bại!";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#A0A0A0"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A0A0A0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.text}>
        Don't have an Account?{" "}
        <Text
          style={styles.boldText}
          onPress={() => navigation.navigate("SignUp")}
        >
          Create One
        </Text>
      </Text>
      <Text style={styles.text}>
        Forgot Password?{" "}
        <Text
          style={styles.boldText}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          Reset
        </Text>
      </Text>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 30,
    backgroundColor: "#FFF",
    width: "100%",
  },

  title: {
    fontSize: 60,
    fontWeight: "bold",
    marginTop: 200,
    marginBottom: 35,
    color: "#000",
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
  text: {
    marginTop: 27,
    fontSize: 20,
    color: "#000",
  },
  boldText: {
    fontWeight: "bold",
    color: "#000",
  },
});
