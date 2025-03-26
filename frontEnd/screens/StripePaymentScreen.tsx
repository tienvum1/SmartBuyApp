import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type StripePaymentScreenRouteProp = RouteProp<ReactNavigation.RootParamList, 'StripePaymentScreen'>;
type StripePaymentScreenNavigationProp = StackNavigationProp<ReactNavigation.RootParamList, 'StripePaymentScreen'>;

type Props = {
  navigation: StripePaymentScreenNavigationProp;
  route: StripePaymentScreenRouteProp;
};

const StripePaymentScreen = ({ navigation, route }: Props) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [paymentSheetInitialized, setPaymentSheetInitialized] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const { amount, shippingAddressId, selectedItemIds } = route.params;

  useEffect(() => {
    // Khởi tạo payment sheet khi người dùng vào màn hình thanh toán
    fetchPaymentIntent();
  }, []);

  const fetchPaymentIntent = async () => {
    try {
      setLoading(true);
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString || '{}');
      const userId = user._id;

      console.log('Fetching payment intent for amount:', amount);
      
      // Gọi API để tạo Payment Intent và lấy client secret
      const response = await axios.post('http://10.0.2.2:5001/stripe/create-payment-intent', {
        amount, // Số tiền cần thanh toán
        currency: 'vnd', // Đơn vị tiền tệ
        description: `Đơn hàng SmartBuy - ${new Date().toISOString()}`,
      });

      console.log('Payment intent response:', response.data);

      if (response.data.success && response.data.clientSecret) {
        setClientSecret(response.data.clientSecret);
        setPaymentIntentId(response.data.paymentIntentId);
        await initializePaymentSheet(response.data.clientSecret);
      } else {
        Alert.alert('Lỗi', 'Không thể khởi tạo thanh toán Stripe');
      }
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi khởi tạo thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const initializePaymentSheet = async (clientSecret: string) => {
    try {
      console.log('Initializing payment sheet...');
      
      // Lấy publishable key từ backend
      const configResponse = await axios.get('http://10.0.2.2:5001/stripe/config');
      console.log('Config response:', configResponse.data);
      
      const { publishableKey } = configResponse.data;
      
      if (!publishableKey) {
        console.error('No publishable key received');
        Alert.alert('Lỗi', 'Không thể lấy khóa Stripe');
        return;
      }

      console.log('Using publishable key:', publishableKey);

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'SmartBuy Store',
        allowsDelayedPaymentMethods: true,
        style: 'alwaysLight',
      });

      if (error) {
        console.error('Error initializing payment sheet:', error);
        Alert.alert('Lỗi', `Không thể khởi tạo phương thức thanh toán: ${error.message}`);
      } else {
        console.log('Payment sheet initialized successfully');
        setPaymentSheetInitialized(true);
      }
    } catch (error) {
      console.error('Error in initializePaymentSheet:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi khởi tạo phương thức thanh toán');
    }
  };

  const handlePayPress = async () => {
    if (!paymentSheetInitialized) {
      Alert.alert('Vui lòng đợi', 'Đang khởi tạo phương thức thanh toán...');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Presenting payment sheet...');
      const { error } = await presentPaymentSheet();
      
      if (error) {
        console.error('Payment sheet error:', error.code, error.message);
        
        // Xử lý các loại lỗi cụ thể của Stripe
        if (error.code === 'Canceled') {
          Alert.alert('Thông báo', 'Bạn đã hủy quá trình thanh toán');
        } else if (error.code === 'Failed') {
          Alert.alert('Thanh toán thất bại', 'Thanh toán không thành công. Vui lòng kiểm tra thông tin thẻ và thử lại.');
        } else {
          Alert.alert('Lỗi thanh toán', error.message || 'Đã xảy ra lỗi khi xử lý thanh toán');
        }
      } else {
        console.log('Payment successful! Processing order...');
        // Thanh toán thành công, gửi thông tin đặt hàng
        processOrder();
      }
    } catch (error: any) {
      console.error('Error in handlePayPress:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const processOrder = async () => {
    try {
      setLoading(true);
      console.log('Processing order...');
      
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString || '{}');
      const userId = user._id;

      console.log('Confirming payment with ID:', paymentIntentId);
      
      // Kiểm tra trạng thái thanh toán
      const paymentResponse = await axios.post('http://10.0.2.2:5001/stripe/confirm-payment', {
        paymentIntentId
      });

      console.log('Payment confirmation response:', paymentResponse.data);

      if (paymentResponse.data.success) {
        console.log('Payment confirmed. Placing order...');
        
        // Đặt hàng sau khi thanh toán thành công
        const orderData = {
          shippingAddressId,
          paymentMethod: 'stripe',
          selectedItemIds,
          total: amount,
          userId: userId,
          paymentIntentId, // Lưu thông tin Payment Intent ID để tham chiếu sau này
        };
        
        console.log('Order data:', orderData);
        
        const orderResponse = await axios.post('http://10.0.2.2:5001/checkouts/placeOrder', orderData);

        console.log('Order response:', orderResponse.data);

        if (orderResponse.data.success) {
          Alert.alert('Thành công', 'Thanh toán thành công và đơn hàng đã được đặt!', [
            { text: 'OK', onPress: () => navigation.navigate('OrderSuccessScreen') }
          ]);
        } else {
          throw new Error(orderResponse.data.message || 'Lỗi đặt hàng');
        }
      } else {
        throw new Error(paymentResponse.data.message || 'Xác nhận thanh toán thất bại');
      }
    } catch (error: any) {
      console.error('Error processing order:', error);
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi xử lý đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán qua Stripe</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng tiền</Text>
            <Text style={styles.summaryValue}>{amount.toLocaleString()} VND</Text>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
          <Text style={styles.infoText}>
            Bạn sẽ được chuyển đến cổng thanh toán an toàn của Stripe để hoàn tất giao dịch.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.disabledButton]}
          onPress={handlePayPress}
          disabled={loading || !clientSecret}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.payButtonText}>
              Thanh toán {amount.toLocaleString()} VND
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 60, // For iOS status bar
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  orderSummary: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  paymentSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  payButton: {
    backgroundColor: '#7B61FF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a9a9a9',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StripePaymentScreen; 