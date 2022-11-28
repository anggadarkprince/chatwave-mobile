import {
  StyleSheet,
  Text,
  TextInput as TextInputNative,
  View,
} from 'react-native';
import Colors from '../Utilities/Colors';
import React, {useState} from 'react';
import {validate} from 'validate.js';

export const TextInput = ({
  id,
  label,
  icon,
  errorText,
  onInputChanged,
  constraints,
  singleError,
  style,
  ...rest
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(rest.initialValue)

  const onChangeText = text => {
    setValue(text);
    if (onInputChanged) {
      onInputChanged(id, text, constraints);
    }
  };

  return (
    <View style={[styles.container, rest.containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocus && styles.inputFocus,
          errorText && styles.inputError,
        ]}>
        {icon && <View style={[
            styles.icon,
            rest.numberOfLines > 1 ? styles.iconAlignTop : {},
        ]}>{icon}</View>}
        <TextInputNative
          style={[
            styles.input,
            rest.numberOfLines > 1 ? styles.inputAlignTop : {},
            icon && {paddingStart: 0},
            style,
          ]}
          placeholderTextColor={Colors.lightGray}
          onChangeText={onChangeText}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={value}
          {...rest}
        />
      </View>
      {errorText && (
        <View style={styles.errorContainer}>
          {validate.isString(errorText) ||
          (validate.isArray(errorText) && errorText.length === 1) ? (
            <Text style={styles.errorText}>{errorText}</Text>
          ) : singleError ? (
            <Text style={styles.errorText}>{errorText[0]}</Text>
          ) : (
            errorText.map((error, index) => (
              <Text key={index} style={styles.errorText}>
                • {error}
              </Text>
            ))
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginHorizontal: 10,
    color: Colors.lightGray,
  },
  input: {
    color: Colors.dark,
    flex: 1,
    fontFamily: 'Poppins-Regular',
    letterSpacing: 0.1,
    verticalAlign: 'middle',
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    letterSpacing: 0.3,
  },
  inputAlignTop: {
    textAlignVertical: 'top',
    alignSelf: 'flex-start'
  },
  iconAlignTop: {
    alignSelf: 'flex-start',
    marginTop: 11,
  },
});
