import React, {useReducer, useCallback, useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {TextInput} from '../../Inputs';
import {AtSymbolIcon, LockClosedIcon} from 'react-native-heroicons/outline';
import Colors from '../../Utilities/Colors';
import {SubmitButton} from '../../Buttons';
import {reducer} from '../../../utils/reducers/formReducer';
import {validate} from '../../../utils/actions/formActions';
import {signIn} from '../../../utils/actions/authActions';
import {useDispatch} from 'react-redux';

const initialState = {
  inputValues: {
    email: '',
    password: '',
  },
  inputConstraint: {
    email: {presence: {allowEmpty: false}, email: true},
    password: {presence: {allowEmpty: false}},
  },
  inputErrors: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignInForm = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [error, setError] = useState();

  const inputChangedHandler = useCallback(
    (inputId, inputValue, constraints) => {
      dispatchFormState({
        inputId: inputId,
        value: inputValue,
        validationResult: validate(inputValue, constraints),
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
      const {email, password} = formState.inputValues;
      await dispatch(signIn(email, password));
    } catch (e) {
      if (['auth/wrong-password', 'auth/user-not-found'].includes(e.code)) {
        dispatchFormState({
          inputId: 'email',
          value: formState.inputValues.email,
          validationResult: e.message,
        });
      } else {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, formState.inputValues]);

  const onSignIn = useCallback(async () => {
    for (const [key, value] of Object.entries(formState.inputValues)) {
      inputChangedHandler(key, value, initialState.inputConstraint[key]);
    }
    if (formState.formIsValid) {
      await authHandler();
    }
  }, [
    authHandler,
    formState.formIsValid,
    formState.inputValues,
    inputChangedHandler,
  ]);

  return (
    <>
      <TextInput
        id="email"
        label="Email"
        placeholder="Username or email address"
        icon={<AtSymbolIcon size={20} color={Colors.lightGray} />}
        keyboardType="email-address"
        autoCapitalize="none"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputErrors?.email}
        constraints={initialState.inputConstraint.email}
        singleError={true}
      />
      <TextInput
        id="password"
        label="Password"
        placeholder="Input your password"
        icon={<LockClosedIcon size={20} color={Colors.lightGray} />}
        autoCapitalize="none"
        secureTextEntry
        onInputChanged={inputChangedHandler}
        errorText={formState.inputErrors?.password}
        constraints={initialState.inputConstraint.password}
      />
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => console.log('Open forgot password screen')}>
        <Text style={styles.linkForgot}>Forgot Password?</Text>
      </TouchableOpacity>
      <SubmitButton
        title="Sign In"
        loading={isLoading}
        onPress={onSignIn}
        style={styles.buttonSubmit}
      />
    </>
  );
};

const styles = StyleSheet.create({
  buttonSubmit: {marginTop: 20},
  linkForgot: {
    marginStart: 'auto',
    marginBottom: 5,
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
  },
});

export default SignInForm;
