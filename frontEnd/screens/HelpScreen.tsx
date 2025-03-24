import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const HelpScreen = ({ navigation }: { navigation: any }) => {
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const faqCategories = [
    {
      title: "Tài khoản & Đăng nhập",
      questions: [
        {
          question: "Làm thế nào để thay đổi mật khẩu?",
          answer:
            "Bạn có thể thay đổi mật khẩu trong phần Cài đặt > Bảo mật hoặc nhấn vào 'Quên mật khẩu' trên màn hình đăng nhập.",
        },
        {
          question: "Tôi quên mật khẩu, làm sao để đặt lại?",
          answer:
            "Trên màn hình đăng nhập, nhấn vào 'Quên mật khẩu', nhập email của bạn và làm theo hướng dẫn để đặt lại mật khẩu.",
        },
      ],
    },
    {
      title: "Thanh toán & Hóa đơn",
      questions: [
        {
          question: "Làm thế nào để thêm phương thức thanh toán?",
          answer:
            "Bạn có thể thêm phương thức thanh toán trong phần Cài đặt > Thanh toán.",
        },
        {
          question: "Tôi không nhận được hóa đơn thanh toán?",
          answer:
            "Vui lòng kiểm tra email của bạn hoặc vào phần 'Lịch sử thanh toán' để xem hóa đơn điện tử.",
        },
      ],
    },
    {
      title: "Hỗ trợ kỹ thuật",
      questions: [
        {
          question: "Ứng dụng bị lỗi, tôi cần làm gì?",
          answer:
            "Bạn có thể thử khởi động lại ứng dụng hoặc kiểm tra bản cập nhật mới nhất trên App Store/Google Play.",
        },
        {
          question: "Tôi không thể nhận thông báo?",
          answer:
            "Hãy kiểm tra cài đặt thông báo trên thiết bị của bạn và đảm bảo ứng dụng có quyền gửi thông báo.",
        },
      ],
    },
  ];

  const toggleExpand = (categoryIndex: number, questionIndex: number) => {
    const newIndex = `${categoryIndex}-${questionIndex}`;
    setExpandedIndex(expandedIndex === newIndex ? null : newIndex);
  };

  const openSupportEmail = () => {
    const email = "support@example.com";
    Linking.openURL(
      `mailto:${email}?subject=Yêu cầu hỗ trợ&body=Chi tiết vấn đề của bạn...`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trung tâm hỗ trợ</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {faqCategories.map((category, catIndex) => (
          <View key={catIndex} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.questions.map((item, qIndex) => {
              const isExpanded = expandedIndex === `${catIndex}-${qIndex}`;
              return (
                <TouchableOpacity
                  key={qIndex}
                  style={styles.faqItem}
                  onPress={() => toggleExpand(catIndex, qIndex)}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.question}>{item.question}</Text>
                    <Icon
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#666"
                    />
                  </View>
                  {isExpanded && (
                    <Text style={styles.answer}>{item.answer}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={openSupportEmail}
          >
            <Text style={styles.contactText}>Liên hệ hỗ trợ qua Email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    padding: 16,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  faqItem: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  answer: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  contactButton: {
    backgroundColor: "#6A5AE0",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  contactText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
});

export default HelpScreen;
