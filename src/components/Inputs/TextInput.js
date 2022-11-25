import { StyleSheet, Text, TextInput as TextInputNative, View } from "react-native"
import Colors from "../Utilities/Colors";
import React, {useState} from "react";
import {validate} from "validate.js";

export const TextInput = ({id, label, icon, errorText, onInputChanged, constraints, singleError, ...rest}) => {
    const [isFocus, setIsFocus] = useState(false);

    const onChangeText = text => {
        if (onInputChanged) {
            onInputChanged(id, text, constraints);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputContainer, isFocus && styles.inputFocus, errorText && styles.inputError]}>
                {icon && <View style={styles.icon}>{icon}</View>}
                <TextInputNative
                    style={styles.input}
                    placeholderTextColor={Colors.lightGray}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    {...rest}
                />
            </View>
            {
                errorText && (
                    <View style={styles.errorContainer}>
                        {validate.isString(errorText) || (validate.isArray(errorText) && errorText.length === 1) ? <Text style={styles.errorText}>{errorText}</Text> : (
                            singleError ? <Text style={styles.errorText}>{errorText[0]}</Text> :  errorText.map((error, index) => <Text key={index} style={styles.errorText}>• {error}</Text>)
                        )}
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
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f5f5f5',
    },
    inputFocus: {
        borderColor: Colors.primary,
    },
    inputError: {
        borderColor: Colors.danger,
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