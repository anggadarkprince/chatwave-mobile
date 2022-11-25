import { StyleSheet, Text, TextInput as TextInputNative, View } from "react-native"
import Colors from "../Utilities/Colors";
import React from "react";

export const TextInput = ({label, icon, errorText, ...rest}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                {icon && <View style={styles.icon}>{icon}</View>}
                <TextInputNative style={styles.input} placeholderTextColor={Colors.lightGray} {...rest} />
            </View>
            {
                errorText && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errorText}</Text>
                    </View>
                )
            }
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 12,
    },
    label: {
        marginVertical: 5,
        fontFamily: 'Poppins-SemiBold',
        letterSpacing: 0.3,
        color: Colors.dark,
    },
    inputContainer: {
        width: '100%',
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginRight: 10,
        color: Colors.lightGray
    },
    input: {
        color: Colors.dark,
        flex: 1,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 0.3,
    },
    errorContainer: {
        marginVertical: 5
    },
    errorText: {
        color: Colors.danger,
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 0.3
    }
});