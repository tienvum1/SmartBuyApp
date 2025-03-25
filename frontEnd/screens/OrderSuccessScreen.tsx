import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import anhSuccess from "../assets/images/anhSuccessful.png";
const OrderSuccessScreen = ({ navigation }: { navigation: any }) => {
  return (
    <ImageBackground
      source={anhSuccess} // Replace with actual illustration URL
      style={styles.background}
      resizeMode="contain"
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>🎉 Order Placed Successfully!</Text>
          <Text style={styles.subtitle}>
            Your order is now being processed.
          </Text>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => console.log("View Order Details")} // Add navigation logic here
          >
            <Text
              style={styles.buttonText}
              onPress={() => navigation.navigate("OrderScreen")}
            >
              View Order Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#8B5CF6", // Solid background color instead of gradient
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1F1F1F",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "400",
  },
  button: {
    backgroundColor: "#8B5CF6", // Matching the background color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default OrderSuccessScreen;
