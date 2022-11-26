import {Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView} from "react-native";
import React, {useState, useReducer, useCallback} from "react";
import {PageTitle} from "../../components/Title";
import {PageContainer} from "../../components/Containers";
import {TextInput} from "../../components/Inputs";
import Colors from "../../components/Utilities/Colors";
import {SubmitButton} from "../../components/Buttons";
import {validateInput} from '../../utils/actions/formActions';
import {AtSymbolIcon, IdentificationIcon, InformationCircleIcon, UserCircleIcon} from "react-native-heroicons/outline";
import {useDispatch, useSelector} from 'react-redux';
import {reducer} from '../../utils/reducers/formReducer';
import {updateLoggedInUserData} from '../../store/authSlice';
import {updateSignedInUserData, userLogout} from "../../utils/actions/authActions";

export const SettingScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const userData = useSelector(state => state.auth.userData);
    const dispatch = useDispatch();

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

    const saveHandler = useCallback(async () => {
        const updatedValues = formState.inputValues;
        setShowSuccessMessage(false);
        try {
            setIsLoading(true);
            await updateSignedInUserData(userData.userId, updatedValues);
            dispatch(updateLoggedInUserData({newData: updatedValues}));
            setShowSuccessMessage(true);

            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [dispatch, formState.inputValues]);

    return (
        <PageContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <KeyboardAvoidingView
                    style={styles.keyboardAvoidingView}
                    behavior={Platform.OS === 'ios' ? 'height' : undefined}
                    keyboardVerticalOffset={100}>
                </KeyboardAvoidingView>
                <PageTitle text="Settings" />

                {showSuccessMessage && <Text style={styles.textSuccess}>User successfully updated!</Text>}
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

                <SubmitButton
                    title="Save"
                    loading={isLoading}
                    onPress={saveHandler}
                    style={{marginTop: 20}}
                    color={Colors.success}
                    disabled={!formState.formIsValid}/>

                <SubmitButton
                    title="Logout"
                    onPress={() => dispatch(userLogout())}
                    style={{marginTop: 10, marginBottom: 20}}
                    color={Colors.danger}
                    disabled={isLoading} />
            </ScrollView>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textSuccess: {
        fontFamily: 'Poppins-Medium',
        color: Colors.success,
        marginBottom: 10,
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#4fca7122',
        borderRadius: 8,
    }
});
