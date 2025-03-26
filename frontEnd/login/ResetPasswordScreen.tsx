import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";

const ResetPasswordScreen = ({ navigation }: { navigation: any }) => {
  const [expiredCode, setExpiredCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      const response = await fetch("http://localhost:5001/users/changePass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expired_code: expiredCode, pass_word: newPassword }),
      });

      if (response.ok) {
        Alert.alert("Success", "Password changed successfully.");
        navigation.navigate("SignIn");
      } else {
        Alert.alert("Error", "Failed to change password.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter reset code"
        value={expiredCode}
        onChangeText={setExpiredCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.buttonText}>Return to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#A178FC",
    paddingVertical: 15,
    width: "80%",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default ResetPasswordScreen;