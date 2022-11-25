import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {SplashScreen} from "./src/screens/Splash";
import {AppNavigator} from "./src/navigation/AppNavigator";

const App = () => {
  const [appIsLoaded, setAppIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAppIsLoaded(true);
    }, 2000)
  }, []);

  if (!appIsLoaded) {
      return  <SplashScreen />;
  }

  return appIsLoaded && (
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
  );
};
export default App;
