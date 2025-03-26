import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PaymentScreen = ({ navigation }: any) => {
  const cards = [
    {
      id: "1",
      number: "**** 4187",
      type: require("../assets/images/mastercard.png"),
    },
    {
      id: "2",
      number: "**** 9387",
      type: require("../assets/images/mastercard.png"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
        <View style={{ width: 24 }} /> {/* Placeholder để căn giữa tiêu đề */}
      </View>

      {/* Danh sách thẻ */}
      <Text style={styles.sectionTitle}>Cards</Text>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardText}>{item.number}</Text>
            <Image source={item.type} style={styles.cardIcon} />
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 80 }} // Để tránh trùng với nút
      />

      {/* Nút Add Card ở cuối màn hình */}
      <View style={styles.addCardContainer}>
        <TouchableOpacity
          style={styles.addCardButton}
          onPress={() => navigation.navigate("AddCardScreen")}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addCardText}>Add Card</Text>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    flex: 1,
  },
  cardIcon: {
    width: 25,
    height: 20,
    marginHorizontal: 10,
  },
  addCardContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8E6CEF",
    padding: 15,
    borderRadius: 12,
  },
  addCardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default PaymentScreen;
