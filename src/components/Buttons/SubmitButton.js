import React from 'react';
import {StyleSheet, TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import Colors from '../Utilities/Colors';

export const SubmitButton = props => {
  const enabledBgColor = props.color || Colors.primary;
  const disabledBgColor = Colors.fade;
  const bgColor = props.disabled ? disabledBgColor : enabledBgColor;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={props.disabled || props.loading}
      onPress={props.disabled ? () => {} : props.onPress}
      style={{
        ...styles.button,
        ...props.style,
        ...{backgroundColor: bgColor},
      }}>
        {props.loading ? (
            <ActivityIndicator size={'small'} color={Colors.white} style={{marginVertical: 3}} />
        ) : (
            <Text style={[styles.buttonText, props.disabled && {color: Colors.gray}]}>
                {props.title}
            </Text>
        )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
    fontSize: 15,
  },
});
