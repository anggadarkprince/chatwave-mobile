import React from 'react';
import {SubmitButton} from "../../Buttons";
import {TextInput} from "../../Inputs";
import {AtSymbolIcon, LockClosedIcon} from "react-native-heroicons/outline";
import Colors from "../../Utilities/Colors";
import {StyleSheet} from "react-native";

const SignUpForm = props => {

    return (
        <>
            <TextInput
                label="First name"
                placeholder="Input your first name"
                icon={<AtSymbolIcon size={20} color={Colors.lightGray} />}/>

            <TextInput
                label="Last name"
                placeholder="Input your last name"
                icon={<AtSymbolIcon size={20} color={Colors.lightGray} />}
            />

            <TextInput
                label="Email"
                placeholder="Input your email address"
                icon={<AtSymbolIcon size={20} color={Colors.lightGray} />}
            />

            <TextInput
                label="Password"
                placeholder="Pick a complex password"
                icon={<LockClosedIcon size={20} color={Colors.lightGray} />}
            />

            <SubmitButton
                title="Sign Up"
                onPress={() => console.log("Button pressed")}
                style={styles.buttonSubmit}
            />
        </>
    )
};

const styles = StyleSheet.create({
    buttonSubmit: {marginTop: 20},
});

export default SignUpForm;