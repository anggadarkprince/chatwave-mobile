import {NavigationContainer} from "@react-navigation/native";
import React from "react";
import {MainNavigator} from "./MainNavigator";
import {AuthScreen} from "../screens/Auth";

export const AppNavigator = () => {
    const isAuth = false;
    return (
        <NavigationContainer>
            {isAuth ? <MainNavigator /> : <AuthScreen />}
        </NavigationContainer>
    );
}