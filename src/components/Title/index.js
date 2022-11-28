import { StyleSheet, Text, View } from "react-native"
import React from "react";
import Colors from "../Utilities/Colors";
import {HeaderButton} from "react-navigation-header-buttons";
import {HeroIcon} from "../Icons";

export const PageTitle = props => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{props.text}</Text>
        </View>
    );
};

export const CustomHeaderButton = props => {
    return (
        <HeaderButton
            { ...props }
            IconComponent={HeroIcon}
            iconSize={24}
            color={props.color ?? Colors.primary }
        />
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10
    },
    text: {
        fontSize: 28,
        color: Colors.dark,
        fontFamily: 'Poppins-Bold',
        letterSpacing: 0.1
    }
})