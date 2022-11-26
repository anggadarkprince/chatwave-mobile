import {Text, View} from "react-native";
import React, {useEffect} from "react";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {CustomHeaderButton} from "../../components/Title";

export const HomeScreen = ({navigation}) => {
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                        <Item
                            title="New chat"
                            iconName="pencil-square"
                            onPress={() => {}}/>
                    </HeaderButtons>
                )
            }
        })
    }, []);

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontFamily: "Poppins-Regular"}} onPress={() => navigation.navigate("Chat")}>Hello ChatWave</Text>
        </View>
    );
};
