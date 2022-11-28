import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../Utilities/Colors';

export const Bubble = props => {
  const {text, type} = props;

  const bubbleStyle = {...styles.container};
  const textStyle = {...styles.text};
  const wrapperStyle = {...styles.wrapperStyle};

  switch (type) {
    case 'system':
      textStyle.color = '#65644A';
      bubbleStyle.backgroundColor = '#fffdd9';
      bubbleStyle.alignItems = 'center';
      bubbleStyle.marginTop = 10;
      break;
    case 'error':
      textStyle.color = Colors.white;
      bubbleStyle.backgroundColor = Colors.danger;
      bubbleStyle.alignItems = 'center';
      bubbleStyle.marginTop = 10;
      break;
    case 'myMessage':
      wrapperStyle.justifyContent = 'flex-end';
      bubbleStyle.backgroundColor = '#E7FED6';
      bubbleStyle.maxWidth = '90%';
      break;
    case 'theirMessage':
      wrapperStyle.justifyContent = 'flex-start';
      bubbleStyle.maxWidth = '90%';
      break;
    default:
      break;
  }

  return (
    <View style={wrapperStyle}>
      <View style={bubbleStyle}>
        <Text style={textStyle}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: Colors.fade,
    borderWidth: 1,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: Colors.dark,
  },
});
