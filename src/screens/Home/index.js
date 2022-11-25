import {Text, View} from "react-native";
import React from "react";

export const HomeScreen = ({navigation}) => {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontFamily: "Poppins-Regular"}} onPress={() => navigation.navigate("Chat")}>Hello ChatWave</Text>
        </View>
    );
};
