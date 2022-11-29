import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Colors from '../Utilities/Colors';
import {XCircleIcon} from 'react-native-heroicons/outline';

export const ReplyTo = props => {
  const {text, user, onCancel} = props;
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text numberOfLines={1}>{text}</Text>
      </View>
      <TouchableOpacity activeOpacity={0.75} onPress={onCancel}>
        <XCircleIcon size={22} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.fadePrimary,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4,
  },
  textContainer: {
    flex: 1,
    marginEnd: 5,
  },
  name: {
    color: Colors.primary,
    fontFamily: 'Poppins-Medium',
  },
});

export default ReplyTo;
