import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import Colors from '../../Utilities/Colors';
import {ProfileImage} from '../../Images';
import {CheckIcon, ChevronRightIcon} from 'react-native-heroicons/outline';
import {HeroIcon} from '../../Icons';

const imageSize = 40;

export const DataItem = props => {
  const {title, subTitle, image, onPress, type, isChecked, icon} = props;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        {!icon && <ProfileImage uri={image} size={42} />}
        {icon && (
          <View style={styles.leftIconContainer}>
            <HeroIcon name={icon} size={20} color={Colors.primary} />
          </View>
        )}

        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {color: type === 'button' ? Colors.primary : Colors.dark},
            ]}>
            {title}
          </Text>
          {subTitle && (
            <Text numberOfLines={1} style={styles.subTitle}>
              {subTitle}
            </Text>
          )}
        </View>
        {type === 'checkbox' && (
          <View style={[styles.iconContainer, isChecked && styles.checked]}>
            <CheckIcon
              size={14}
              color={isChecked ? Colors.white : Colors.darkGray}
            />
          </View>
        )}
        {type === 'link' && (
          <View>
            <ChevronRightIcon size={14} color={Colors.darkGray} />
          </View>
        )}
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
    flex: 1,
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
  iconContainer: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: Colors.lightGray,
    padding: 4,
  },
  checked: {
    backgroundColor: Colors.primary,
    borderColor: 'transparent',
  },
  leftIconContainer: {
    backgroundColor: Colors.fadePrimary,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: imageSize,
    height: imageSize,
  },
});
