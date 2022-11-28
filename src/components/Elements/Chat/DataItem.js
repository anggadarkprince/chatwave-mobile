import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import Colors from '../../Utilities/Colors';
import {ProfileImage} from '../../Images';

export const DataItem = props => {
  const {title, subTitle, image, onPress} = props;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <ProfileImage uri={image} size={42} />

        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.subTitle}>
            {subTitle}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: Colors.light,
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 50,
  },
  textContainer: {
    marginLeft: 14,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.dark,
  },
  subTitle: {
    fontFamily: 'Poppins-Regular',
    color: Colors.gray,
    fontSize: 13,
    lineHeight: 18,
  },
});
