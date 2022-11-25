import React from 'react';
import {StyleSheet} from 'react-native';
import {TextInput} from '../../Inputs';
import {AtSymbolIcon, LockClosedIcon} from "react-native-heroicons/outline";
import Colors from "../../Utilities/Colors";
import {SubmitButton} from "../../Buttons";

const SignInForm = props => {
    return (
        <>
            <TextInput
                label="Email"
                placeholder="Input email address"
                icon={<AtSymbolIcon size={20} color={Colors.lightGray} />}
            />
            <TextInput
                label="Password"
                placeholder="Input your password"
                icon={<LockClosedIcon size={20} color={Colors.lightGray} />}
            />
            <SubmitButton
                title="Sign In"
                onPress={() => console.log("Button pressed")}
                style={styles.buttonSubmit}
            />
        </>
    )
};

const styles = StyleSheet.create({
    buttonSubmit: {marginTop: 20},
});

export default SignInForm;