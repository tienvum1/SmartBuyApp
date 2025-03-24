import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";

// Định nghĩa type cho Address
type Address = {
  address: string;
  phone?: string;

  _id?: string; // ID của địa chỉ (tự động tạo bởi MongoDB)
};

// Định nghĩa type cho User
type User = {
  _id: string;
  address: Address[];
};

// Định nghĩa type cho navigation và route
interface AllAddressesScreenProps {
  navigation: any;
  route: any;
}

// Hằng số cho style
const COLORS = {
  white: "#fff",
  black: "#000",
  gray: "#e0e0e0",
  darkGray: "#333",
  primary: "#6B48FF",
  red: "red",
};

const SIZES = {
  borderRadius: 12,
  padding: 16,
  fontLarge: 18,
  fontMedium: 16,
  fontSmall: 14,
  iconSize: 24,
};

const AllAddressesScreen: React.FC<AllAddressesScreenProps> = ({
  navigation,
  route,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Hàm lấy thông tin user và danh sách địa chỉ
  const fetchUserAndAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      // Lấy user từ AsyncStorage
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập để xem địa chỉ!");
        navigation.navigate("SignIn");
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Gọi API để lấy thông tin user (bao gồm danh sách địa chỉ)
      const response = await axios.get(
        `http://10.0.2.2:5001/users/getUserById/${userData._id}`
      );

      if (response.data && response.data.address) {
        // Đảm bảo mỗi địa chỉ đều có một _id được chuyển thành string
        const addressList = response.data.address.map((addr: any) => ({
          ...addr,
          _id: addr._id ? addr._id.toString() : undefined,
        }));
        console.log("Addresses after converting _id to string:", addressList);
        setAddresses(addressList);
      } else {
        setAddresses([]);
      }
    } catch (error: any) {
      console.error("Error fetching addresses:", error);
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể lấy danh sách địa chỉ"
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigation]);

  // Lấy danh sách địa chỉ khi màn hình mount
  useEffect(() => {
    fetchUserAndAddresses();
  }, [fetchUserAndAddresses]);

  // Làm mới danh sách địa chỉ sau khi thêm địa chỉ mới hoặc quay lại màn hình
  useEffect(() => {
    // Khi màn hình được focus (hiển thị), làm mới danh sách địa chỉ
    const unsubscribeFocus = navigation.addListener("focus", () => {
      console.log("Screen focused - refreshing addresses");
      fetchUserAndAddresses();
    });

    // Khi điều hướng quay lại màn hình này, làm mới địa chỉ
    const unsubscribeBlur = navigation.addListener("blur", () => {
      console.log("Screen blurred - will refresh on return");
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, fetchUserAndAddresses]);

  // Hàm xóa địa chỉ
  const handleDeleteAddress = async (addressId: string) => {
    if (!user?._id) return;

    console.log("Deleting address with ID:", addressId);
    console.log("User ID:", user._id);

    // Tìm địa chỉ thực tế muốn xóa
    const addressToDelete = addresses.find((addr) => addr._id === addressId);
    if (!addressToDelete) {
      console.error("Address not found in local state:", addressId);
      Alert.alert("Lỗi", "Không tìm thấy địa chỉ để xóa");
      return;
    }

    console.log("Full address object to delete:", addressToDelete);
    console.log(
      "Available addresses:",
      addresses.map((addr) => ({
        id: addr._id,
        address: addr.address,
      }))
    );

    setIsDeleting(addressId);
    try {
      const response = await axios.delete(
        `http://10.0.2.2:5001/removeAddress/${user._id}/${addressId}`
      );

      if (response.status === 200) {
        // Lấy thông tin địa chỉ đã xóa từ response nếu có
        const removedAddress = response.data.removedAddress;
        console.log("Successfully removed address:", removedAddress);

        if (removedAddress && removedAddress._id) {
          // Xóa dựa trên ID từ response
          setAddresses((prev) =>
            prev.filter((addr) => addr._id !== removedAddress._id.toString())
          );
        } else {
          // Fallback: xóa dựa trên ID đã truyền vào
          setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
        }

        Alert.alert("Thành công", "Địa chỉ đã được xóa!");
      }
    } catch (error: any) {
      console.error("Error deleting address:", error);

      // Nếu gặp lỗi 404, thử làm mới danh sách địa chỉ
      if (error.response?.status === 404) {
        Alert.alert(
          "Lỗi",
          "Không tìm thấy địa chỉ trên máy chủ. Làm mới danh sách...",
          [
            {
              text: "OK",
              onPress: () => fetchUserAndAddresses(),
            },
          ]
        );
      } else {
        Alert.alert(
          "Lỗi",
          error.response?.data?.message || "Không thể xóa địa chỉ"
        );
      }
    } finally {
      setIsDeleting(null);
    }
  };

  // Xác nhận trước khi xóa
  const confirmDelete = (addressId: string) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa địa chỉ này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => handleDeleteAddress(addressId),
        },
      ],
      { cancelable: true }
    );
  };

  // Component hiển thị từng địa chỉ
  const renderAddressItem = ({ item }: { item: Address }) => {
    // Đảm bảo _id là một string hợp lệ
    const addressId = item._id?.toString();

    return (
      <View style={styles.addressItem}>
        <View style={styles.addressInfo}>
          <Text style={styles.addressText}>Địa chỉ: {item.address}</Text>
          <Text style={styles.phoneText}>Số điện thoại: {item.phone}</Text>
          <Text style={styles.idText}>ID: {addressId || "Không có ID"}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            addressId
              ? confirmDelete(addressId)
              : Alert.alert("Lỗi", "Không thể xóa địa chỉ này vì thiếu ID")
          }
          disabled={isDeleting === addressId || !addressId}
          style={[
            styles.deleteButton,
            !addressId && styles.deleteButtonDisabled,
          ]}
        >
          {isDeleting === addressId ? (
            <ActivityIndicator size="small" color={COLORS.red} />
          ) : (
            <Icon
              name="delete"
              size={SIZES.iconSize}
              color={addressId ? COLORS.red : COLORS.gray}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Hiển thị loading khi đang lấy dữ liệu
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tiêu đề và nút thêm địa chỉ */}
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách địa chỉ</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddAddressScreen")}
          style={styles.addButton}
        >
          <Icon name="add" size={SIZES.iconSize} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Danh sách địa chỉ */}
      {addresses.length === 0 ? (
        <Text style={styles.emptyText}>Bạn chưa có địa chỉ nào!</Text>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item, index) =>
            item._id?.toString() || `address-${index}-${item.address}`
          }
          renderItem={renderAddressItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  title: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.black,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: SIZES.borderRadius,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 10,
    fontSize: SIZES.fontMedium,
    color: COLORS.darkGray,
  },
  listContainer: {
    padding: SIZES.padding,
    paddingBottom: 80,
  },
  addressItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  addressInfo: {
    flex: 1,
    marginRight: 10,
  },
  addressText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.black,
    marginBottom: 5,
  },
  phoneText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.darkGray,
  },
  idText: {
    fontSize: SIZES.fontSmall - 2,
    color: COLORS.darkGray,
    opacity: 0.5,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  emptyText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.darkGray,
    textAlign: "center",
    marginTop: 20,
  },
});

export default AllAddressesScreen;
