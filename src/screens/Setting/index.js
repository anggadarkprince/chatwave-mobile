import {Text, StyleSheet, ActivityIndicator} from "react-native";
import React, {useState, useReducer, useCallback} from "react";
import {PageTitle} from "../../components/Title";
import {PageContainer} from "../../components/Containers";
import {TextInput} from "../../components/Inputs";
import Colors from "../../components/Utilities/Colors";
import {SubmitButton} from "../../components/Buttons";
import {validateInput} from '../../utils/actions/formActions';
import {AtSymbolIcon, IdentificationIcon, InformationCircleIcon, UserCircleIcon} from "react-native-heroicons/outline";
import {useSelector} from 'react-redux';
import {reducer} from '../../utils/reducers/formReducer';

export const SettingScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const userData = useSelector(state => state.auth.userData);

    const initialState = {
        inputValues: {
            firstName: userData.firstName || "",
            lastName:  userData.lastName || "",
            email:  userData.email || "",
            about:  userData.about || "",
        },
        inputErrors: {
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            about: undefined,
        },
        formIsValid: false
    }

    const [formState, dispatchFormState] = useReducer(reducer, initialState);

    const inputChangedHandler = useCallback((inputId, inputValue) => {
        dispatchFormState({
            inputId: inputId,
            value: inputValue,
            validationResult: validateInput(inputId, inputValue),
        });
    }, [dispatchFormState]);

    const saveHandler = () => {

    }

    return <PageContainer>
        <PageTitle text="Settings" />

        <TextInput
            id="firstName"
            label="First name"
            placeholder="Input your last name"
            icon={<UserCircleIcon size={20} color={Colors.lightGray} />}
            onInputChanged={inputChangedHandler}
            errorText={formState.inputErrors?.firstName}
            initialValue={userData.firstName} />

        <TextInput
            id="lastName"
            label="Last name"
            placeholder="Input your email address"
            icon={<IdentificationIcon size={20} color={Colors.lightGray} />}
            onInputChanged={inputChangedHandler}
            errorText={formState.inputErrors?.lastName}
            initialValue={userData.lastName} />

        <TextInput
            id="email"
            label="Email"
            placeholder="Input your email address"
            icon={<AtSymbolIcon size={20} color={Colors.lightGray} />}
            onInputChanged={inputChangedHandler}
            keyboardType="email-address"
            autoCapitalize="none"
            errorText={formState.inputErrors?.email}
            initialValue={userData.email} />

        <TextInput
            id="about"
            label="About"
            placeholder="Tell about yourself"
            icon={<InformationCircleIcon size={20} color={Colors.lightGray} />}
            onInputChanged={inputChangedHandler}
            autoCapitalize="none"
            multilines={true}
            numberOfLines={3}
            errorText={formState.inputErrors?.about}
            initialValue={userData.about} />

        {
            isLoading ?
                <ActivityIndicator size={'small'} color={Colors.primary} style={{marginTop: 20}} /> :
                <SubmitButton
                    title="Save"
                    onPress={saveHandler}
                    style={{marginTop: 20}}
                    disabled={!formState.formIsValid}/>
        }
    </PageContainer>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
