import React from "react";
import { View, Text, TouchableOpacity, StyleSheet ,Image} from "react-native";

const ResetPasswordScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        We sent you an email to reset your password.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.buttonText}>Return to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: { fontSize: 60, marginBottom: 20, textAlign: "center" },
  button: {
    backgroundColor: "#A178FC",
    paddingVertical: 15,
    width: "40%",
    height: 60,
    alignItems: "center",
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});
