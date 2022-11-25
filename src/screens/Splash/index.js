import {StatusBar, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import { authenticate, setDidTryAutoLogin } from "../../store/authSlice";
import { getUserData } from "../../utils/actions/userActions";

export const SplashScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const storedAuthInfo = await AsyncStorage.getItem('userData');
      if (!storedAuthInfo) {
        dispatch(setDidTryAutoLogin());
      } else {
        const parsedData = JSON.parse(storedAuthInfo);
        const {token, userId, expiryDate: expiryDateString} = parsedData;
        const expiryDate = new Date(expiryDateString);
        if (expiryDate <= new Date() || !token || !userId) {
          dispatch(setDidTryAutoLogin());
        } else {
          const userData = await getUserData(userId);
          dispatch(authenticate({token: token, userData}));
        }
      }
    })();
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ee4a63',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <StatusBar
        barStyle={'light-content'}
        translucent
        backgroundColor="transparent"
      />
      <Image
        source={require('../../../assets/images/chatwave.png')}
        resizeMode="contain"
        style={{height: 250, width: 250}}
      />
    </View>
  );
};
