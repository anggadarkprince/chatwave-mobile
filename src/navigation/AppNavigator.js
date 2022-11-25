import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {MainNavigator} from './MainNavigator';
import {AuthScreen} from '../screens/Auth';
import {useSelector} from 'react-redux';
import {SplashScreen} from '../screens/Splash';

export const AppNavigator = () => {
  const isAuth = useSelector(
    state => state.auth.token !== null && state.auth.token !== '',
  );
  const didTryAutoLogin = useSelector(state => state.auth?.didTryAutoLogin);

  const renderAuthScreen = () =>
    didTryAutoLogin ? <AuthScreen /> : <SplashScreen />;

  return (
    <NavigationContainer>
      {isAuth ? <MainNavigator /> : renderAuthScreen()}
    </NavigationContainer>
  );
};
