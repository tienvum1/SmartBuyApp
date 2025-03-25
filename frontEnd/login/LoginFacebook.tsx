import React from 'react';
import { View, Button, Alert } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native'; // Thêm import này

// Định nghĩa type cho navigation prop
type FacebookLoginProps = {
  navigation: NavigationProp<any>;
};

const FacebookLogin: React.FC<FacebookLoginProps> = ({ navigation }) => {
  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        Alert.alert('Login cancelled');
        return;
      }
      
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        Alert.alert('Login failed');
        return;
      }
  
      console.log('Access Token:', data.accessToken.toString());
  
      const response = await fetch('http://localhost:5001/users/loginFb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: data.accessToken.toString(),
        }),
      });
  
      const responseData = await response.json();
      // trả response từ be
      if (response.ok) {
        await AsyncStorage.setItem('token', responseData.token);
        await AsyncStorage.setItem('user',responseData.user)

        Alert.alert('Login successful', `Token: ${responseData.token}`);
        navigation.navigate('HomePage');
      } else {
        Alert.alert('Login failed', responseData.message);
      }
    } catch (error :any ) {
      console.error('Error during Facebook login:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <Button title="Login with Facebook" onPress={handleFacebookLogin} />
    </View>
  );
};

export default FacebookLogin;