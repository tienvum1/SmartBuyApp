import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StripeProvider } from '@stripe/stripe-react-native';
import axios from 'axios';

import SplashScreen from "./login/SplashScreen";
import SignInScreen from "./login/SignInScreen";
import SignUpScreen from "./login/SignUpScreen";
import ForgotPasswordScreen from "./login/ForgotPasswordScreen";
import ResetPasswordScreen from "./login/ResetPasswordScreen";
import HomePage from "./screens/HomePage";
import CategoryScreen from "./screens/CategoryScreen";
import ProductScreen from "./screens/ProductScreen";
import DetailProduct from "./screens/DetailProduct";
import NotificationScreen from "./screens/NotificationScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderDetailScreen from "./screens/OderDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import PaymentScreen from "./screens/PaymentScreen";
import AddCardScreen from "./screens/AddCardScreen";
import HelpScreen from "./screens/HelpScreen";
import CartScreen from "./screens/CartScreen";
import CheckoutDetailScreen from "./screens/CheckoutDetailScreen";
import WishListScreen from "./screens/WishListScreen";
import OrderSuccessScreen from "./screens/OrderSuccessScreen";
import AddAddressScreen from "./screens/AddAddressScreen";
import AllAddressScreen from "./screens/AllAddressScreen";
import StripePaymentScreen from "./screens/StripePaymentScreen";

// Khai báo Stack Navigator không cần chỉ định kiểu
const Stack = createStackNavigator();

export default function App() {
  const [publishableKey, setPublishableKey] = useState('');

  // Lấy Stripe publishable key khi ứng dụng khởi động
  useEffect(() => {
    fetchPublishableKey();
  }, []);

  const fetchPublishableKey = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5001/stripe/config');
      const key = response.data.publishableKey;
      if (key) {
        setPublishableKey(key);
      }
    } catch (error) {
      console.error("Không thể lấy Stripe publishable key:", error);
    }
  };

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.com.smartbuy.app"
    >
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen as any} />
          <Stack.Screen name="SignIn" component={SignInScreen as any} />
          <Stack.Screen name="SignUp" component={SignUpScreen as any} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen as any} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen as any} />
          <Stack.Screen name="HomePage" component={HomePage as any} />
          <Stack.Screen name="CategoryScreen" component={CategoryScreen as any} />
          <Stack.Screen name="ProductScreen" component={ProductScreen as any} />
          <Stack.Screen name="DetailProduct" component={DetailProduct as any} />
          <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen as any}
          />
          <Stack.Screen name="OrderScreen" component={OrderScreen as any} />
          <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen as any} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen as any} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen as any} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen as any} />
          <Stack.Screen name="AddCardScreen" component={AddCardScreen as any} />
          <Stack.Screen name="HelpScreen" component={HelpScreen as any} />
          <Stack.Screen name="CartScreen" component={CartScreen as any} />
          <Stack.Screen
            name="CheckoutDetailScreen"
            component={CheckoutDetailScreen as any}
          />
          <Stack.Screen name="WishListScreen" component={WishListScreen as any} />
          <Stack.Screen
            name="OrderSuccessScreen"
            component={OrderSuccessScreen as any}
          />
          <Stack.Screen name="AddAddressScreen" component={AddAddressScreen as any} />
          <Stack.Screen name="AllAddressScreen" component={AllAddressScreen as any} />
          <Stack.Screen name="StripePaymentScreen" component={StripePaymentScreen as any} />
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}
