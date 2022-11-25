import React, {useReducer, useCallback, useState, useEffect} from 'react';
import {SubmitButton} from '../../Buttons';
import {TextInput} from '../../Inputs';
import {
  AtSymbolIcon,
  IdentificationIcon,
  LockClosedIcon,
  UserCircleIcon,
} from 'react-native-heroicons/outline';
import Colors from '../../Utilities/Colors';
import {
  StyleSheet,
  Text,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {reducer} from '../../../utils/reducers/formReducer';
import {validateInput} from '../../../utils/actions/formActions';
import {signUp} from '../../../utils/actions/authActions';
import {useDispatch} from 'react-redux';

const initialState = {
  inputValues: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  },
  inputErrors: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignUpForm = () => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const dispatch = useDispatch();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      dispatchFormState({
        inputId: inputId,
        value: inputValue,
        isValid: validateInput(inputId, inputValue),
      });
    },
    [dispatchFormState],
  );

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{text: 'Okay'}]);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      await dispatch(signUp(formState.inputValues));
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        dispatchFormState({
          inputId: 'email',
          value: formState.inputValues.email,
          isValid: e.message,
        });
      } else {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, formState.inputValues]);

  return (
    <>
      <TextInput
        id="firstName"
        label="First name"
        placeholder="Input your first name"
        icon={<UserCircleIcon size={20} color={Colors.lightGray} />}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputErrors?.firstName}
      />

      <TextInput
        id="lastName"
        label="Last name"
        placeholder="Input your last name"
        icon={<IdentificationIcon size={20} color={Colors.lightGray} />}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputErrors?.lastName}
      />

      <TextInput
        id="email"
        label="Email"
        placeholder="Input your email address"
        icon={<AtSymbolIcon size={20} color={Colors.lightGray} />}
        keyboardType="email-address"
        autoCapitalize="none"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputErrors?.email}
      />

      <TextInput
        id="password"
        label="Password"
        placeholder="Pick a complex password"
        icon={<LockClosedIcon size={20} color={Colors.lightGray} />}
        autoCapitalize="none"
        secureTextEntry
        onInputChanged={inputChangedHandler}
        errorText={formState.inputErrors?.password}
      />

      <Text style={styles.text}>
        By signing up you are agree to{' '}
        <Text
          style={styles.textLink}
          onPress={() =>
            Linking.openURL('https://chatwave.angga-ari.com/agreement')
          }>
          Terms & Conditions
        </Text>{' '}
        and{' '}
        <Text
          style={styles.textLink}
          onPress={() =>
            Linking.openURL('https://chatwave.angga-ari.com/privacy')
          }>
          Privacy Policy
        </Text>
      </Text>

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={styles.spinner} />
      ) : (
        <SubmitButton
          title="Sign Up"
          onPress={authHandler}
          style={styles.buttonSubmit}
          disabled={!formState.formIsValid}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonSubmit: {
    marginTop: 20,
  },
  text: {
    color: Colors.dark,
    fontFamily: 'Poppins-Regular',
  },
  textLink: {
    color: Colors.primary,
    fontFamily: 'Poppins-Medium',
  },
  spinner: {
    marginVertical: 20,
  },
});

export default SignUpForm;
