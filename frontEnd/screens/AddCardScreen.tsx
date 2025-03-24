import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AddCardScreen = ({ navigation }: any) => {
  const [cardNumber, setCardNumber] = useState("");
  const [ccv, setCcv] = useState("");
  const [exp, setExp] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Card</Text>
        <View style={{ width: 24 }} /> {/* Placeholder để căn giữa tiêu đề */}
      </View>

      {/* Form nhập thông tin */}
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={cardNumber}
        onChangeText={setCardNumber}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="CCV"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={ccv}
          onChangeText={setCcv}
        />
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Exp"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={exp}
          onChangeText={setExp}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Cardholder Name"
        placeholderTextColor="#999"
        value={cardholderName}
        onChangeText={setCardholderName}
      />

      {/* Nút Save */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => alert("Card Saved!")}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallInput: {
    flex: 1,
    marginRight: 10,
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  saveButton: {
    backgroundColor: "#8A63D2",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddCardScreen;
