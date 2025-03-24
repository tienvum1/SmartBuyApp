import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

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

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="ProductScreen" component={ProductScreen} />
        <Stack.Screen name="DetailProduct" component={DetailProduct} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen name="OrderScreen" component={OrderScreen} />
        <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="AddCardScreen" component={AddCardScreen} />
        <Stack.Screen name="HelpScreen" component={HelpScreen} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen
          name="CheckoutDetailScreen"
          component={CheckoutDetailScreen}
        />
        <Stack.Screen name="WishListScreen" component={WishListScreen} />
        <Stack.Screen
          name="OrderSuccessScreen"
          component={OrderSuccessScreen}
        />
        <Stack.Screen name="AddAddressScreen" component={AddAddressScreen} />
        <Stack.Screen name="AllAddressScreen" component={AllAddressScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
