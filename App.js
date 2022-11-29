import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/navigation/AppNavigator';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {LogBox} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';

LogBox.ignoreLogs(['AsyncStorage has been extracted']);

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <MenuProvider>
          <AppNavigator />
        </MenuProvider>
      </SafeAreaProvider>
    </Provider>
  );
};
export default App;
