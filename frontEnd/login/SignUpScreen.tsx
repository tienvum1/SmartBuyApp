import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const SignUpScreen = ({ navigation }: { navigation: any }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await axios.post("http://10.0.2.2:5001/users/register", {
        full_name: fullName,
        email,
        password,
      });

      Alert.alert("Đăng ký thành công!");
      navigation.navigate("SignIn");
    } catch (error :any) {
      Alert.alert(
        "Lỗi đăng ký",
        error.response?.data?.message || "Lỗi hệ thống"
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Ionicons name="chevron-back" size={40} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Tạo tài khoản</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
      <Text style={styles.text}>
        Đã có tài khoản?{" "}
        <Text
          style={styles.boldText}
          onPress={() => navigation.navigate("SignIn")}
        >
          Đăng nhập
        </Text>
      </Text>
    </View>
  );
};

export default SignUpScreen;

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
    marginTop: 190,
    marginBottom: 35,
    color: "#000",
  },
  icon: {
    position: "absolute",
    top: 100,
    left: 30,
    zIndex: 1,
    backgroundColor: "#F5F5F5",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
    marginTop: 27,
    fontSize: 20,
  },
});
