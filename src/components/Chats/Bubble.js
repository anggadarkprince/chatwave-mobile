import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../Utilities/Colors';

export const Bubble = props => {
  const {text, type} = props;

  const bubbleStyle = {...styles.container};
  const textStyle = {...styles.text};

  switch (type) {
    case 'system':
      textStyle.color = '#65644A';
      bubbleStyle.backgroundColor = '#fffdd9';
      bubbleStyle.alignItems = 'center';
      bubbleStyle.marginTop = 10;
      break;

    default:
      break;
  }

  return (
    <View style={styles.wrapperStyle}>
      <View style={bubbleStyle}>
        <Text style={textStyle}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderColor: Colors.fade,
    borderWidth: 1,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark,
  },
});
