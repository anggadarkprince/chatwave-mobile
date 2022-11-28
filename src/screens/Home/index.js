import {Text, View, FlatList} from 'react-native';
import React, {useEffect} from 'react';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {CustomHeaderButton, PageTitle} from '../../components/Title';
import {useSelector} from 'react-redux';
import {PageContainer} from '../../components/Containers';
import {DataItem} from '../../components/Elements/Chat/DataItem';

export const HomeScreen = ({navigation, route}) => {
  const selectedUser = route?.params?.selectedUserId;
  const userData = useSelector(state => state.auth.userData);
  const storedUsers = useSelector(state => state.users.storedUsers);
  const userChats = useSelector(state => {
    const chatsData = state.chats.chatsData;
    return Object.values(chatsData);
  });

  console.log(storedUsers);

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
    <PageContainer>
      <PageTitle text="Chats" />
      <FlatList
        data={userChats}
        renderItem={itemData => {
          const chatData = itemData.item;
          const chatId = chatData.key;

          const otherUserId = chatData.users.find(
            uid => uid !== userData.userId,
          );
          const otherUser = storedUsers[otherUserId];

          if (!otherUser) {
            return;
          }

          const title = `${otherUser.firstName} ${otherUser.lastName}`;
          const subTitle = chatData.latestMessageText || 'A new chat message';
          const image = otherUser.profilePicture;

          return (
            <DataItem
              title={title}
              subTitle={subTitle}
              image={image}
              onPress={() => navigation.navigate('Chat', {chatId})}
            />
          );
        }}
      />
    </PageContainer>
  );
};
