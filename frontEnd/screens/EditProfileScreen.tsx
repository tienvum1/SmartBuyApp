import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Sử dụng Ionicons cho nút quay lại

const EditProfileScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header với nút quay lại và tiêu đề */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      {/* Form nhập liệu */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Name" />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Address" />
        </View>
      </View>

      {/* Nút Save */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  form: {
    flex: 1,
    justifyContent: "flex-start",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#6A5AE0",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  saveText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
});

export default EditProfileScreen;
