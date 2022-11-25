import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Colors from "../Utilities/Colors";

export const SubmitButton = props => {
    const enabledBgColor = props.color || Colors.primary;
    const disabledBgColor = Colors.lightGray;
    const bgColor = props.disabled ? disabledBgColor : enabledBgColor;

    return (
        <TouchableOpacity
            onPress={props.disabled ? () => {} : props.onPress}
            style={{
                ...styles.button,
                ...props.style,
                ...{ backgroundColor: bgColor
            }}}
        >
            <Text style={[styles.buttonText, props.disabled && {color:  Colors.grey}]}>
                {props.title}
            </Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Poppins-Medium',
        color: Colors.white,
        fontSize: 15
    },
});