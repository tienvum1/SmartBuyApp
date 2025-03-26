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
      const response = await axios.post("http://localhost:5001/users/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data; // Giả sử API trả về token và thông tin user

        // Lưu token vào AsyncStorage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        Alert.alert("Thành công", "Đăng nhập thành công!");
        navigation.navigate("HomePage");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Đăng nhập thất bại!";
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
