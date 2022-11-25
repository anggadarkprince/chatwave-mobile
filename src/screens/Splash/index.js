import {StatusBar, View,Image} from "react-native";
import React from "react";

export const SplashScreen = () => {
    return (
        <View style={{flex: 1, backgroundColor: '#ee4a63', alignItems: 'center', justifyContent: 'center'}}>
            <StatusBar barStyle={"light-content"} translucent backgroundColor="transparent" />
            <Image source={require('../../../assets/images/chatwave.png')} resizeMode="contain" style={{height: 250, width: 250}} />
        </View>
    );
};
