import {Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {CustomHeaderButton} from '../../components/Title';
import {useSelector} from 'react-redux';

export const HomeScreen = ({navigation, route}) => {
  const selectedUser = route?.params?.selectedUserId;
  const userData = useSelector(state => state.auth.userData);

  useEffect(() => {
    if (selectedUser) {
      const chatUsers = [selectedUser, userData.userId];
      const navigationProps = {
        newChatData: {
          users: chatUsers,
        },
      };
      navigation.navigate('Chat', navigationProps);
    }
  }, [navigation, selectedUser, userData.userId, route?.params]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="New chat"
              iconName="pencil-square"
              onPress={() => navigation.navigate('NewChat')}
            />
          </HeaderButtons>
        );
      },
    });
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{fontFamily: 'Poppins-Regular'}}
        onPress={() => navigation.navigate('Chat')}>
        Hello ChatWave
      </Text>
    </View>
  );
};
