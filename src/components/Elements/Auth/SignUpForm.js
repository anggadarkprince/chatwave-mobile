import React, {useReducer, useCallback} from 'react';
import {SubmitButton} from "../../Buttons";
import {TextInput} from "../../Inputs";
import {AtSymbolIcon, IdentificationIcon, LockClosedIcon, UserCircleIcon} from "react-native-heroicons/outline";
import Colors from "../../Utilities/Colors";
import {StyleSheet, Text, Linking} from "react-native";
import {reducer} from "../../../utils/reducers/formReducer";
import {validateInput} from "../../../utils/actions/formActions";

const initialState = {
    inputErrors: {
        firstName: false,
        lastName: false,
        email: false,
        password: false,
    },
    formIsValid: false
}

const SignUpForm = () => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState);

    const inputChangedHandler = useCallback((inputId, inputValue) => {
        dispatchFormState({
            inputId: inputId,
            isValid: validateInput(inputId, inputValue)
        });
    }, [dispatchFormState]);

    return (
        <>
            <TextInput
                id="firstName"
                label="First name"
                placeholder="Input your first name"
                icon={<UserCircleIcon size={20} color={Colors.lightGray}/>}
                onInputChanged={inputChangedHandler}
                errorText={formState.inputErrors?.firstName}
            />

            <TextInput
                id="lastName"
                label="Last name"
                placeholder="Input your last name"
                icon={<IdentificationIcon size={20} color={Colors.lightGray}/>}
                onInputChanged={inputChangedHandler}
                errorText={formState.inputErrors?.lastName}
            />

            <TextInput
                id="email"
                label="Email"
                placeholder="Input your email address"
                icon={<AtSymbolIcon size={20} color={Colors.lightGray}/>}
                keyboardType="email-address"
                autoCapitalize="none"
                onInputChanged={inputChangedHandler}
                errorText={formState.inputErrors?.email}
            />

            <TextInput
                id="password"
                label="Password"
                placeholder="Pick a complex password"
                icon={<LockClosedIcon size={20} color={Colors.lightGray}/>}
                autoCapitalize="none"
                secureTextEntry
                onInputChanged={inputChangedHandler}
                errorText={formState.inputErrors?.password}
            />

            <Text style={styles.text}>
                By signing up you are agree to{' '}
                <Text
                    style={styles.textLink}
                    onPress={() => Linking.openURL('agreement')}>
                    Terms & Conditions
                </Text>{' '}
                and{' '}
                <Text
                    style={styles.textLink}
                    onPress={() => Linking.openURL('privacy')}>
                    Privacy Policy
                </Text>
            </Text>

            <SubmitButton
                title="Sign Up"
                onPress={() => console.log("Button pressed")}
                style={styles.buttonSubmit}
                disabled={!formState.formIsValid}
            />
        </>
    )
};

const styles = StyleSheet.create({
    buttonSubmit: {marginTop: 20},
    text: {
        color: Colors.dark,
        fontFamily: 'Poppins-Regular',
    },
    textLink: {
        color: Colors.primary,
        fontFamily: 'Poppins-Medium',
    },
});

export default SignUpForm;